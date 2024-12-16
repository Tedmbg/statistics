const express = require('express');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const cors = require('cors')
const cron = require('node-cron');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const morgan = require('morgan');
const { format } = require('date-fns'); // Import date-fns



// Load environment variables
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

// Initialize Express
const app = express();

// Configure CORS
app.use(cors({
    origin: ['http://localhost:5173', 'https://statistics-production-032c.up.railway.app'], 
    methods: 'GET,POST,PUT,DELETE', 
    credentials: true
}));

// Middleware to parse JSON
app.use(express.json());

// Define the server port
const PORT = process.env.PORT || 3000;

// PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,  // Adjust based on security requirements
  },
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to the database');
  release();
});

app.use(morgan('dev')); // Log all HTTP requests


// Schedule a task to run daily at midnight
cron.schedule('0 0 * * *', async () => {
    console.log('Running cron job to update class statuses...');
    try {
        // Update status to 'completed' for classes where end_date has passed
        const result = await pool.query(`
            UPDATE discipleship_classes
            SET status = 'completed'
            WHERE end_date < CURRENT_DATE AND status != 'completed';
        `);

        console.log(`Updated ${result.rowCount} classes to completed status.`);
    } catch (err) {
        console.error('Error updating class statuses:', err);
    }
});

const authenticateAdmin = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ status: 'error', message: 'Unauthorized. Token is missing.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        // Check if the user has an admin role
        if (decoded.role !== 'Admin') {
            return res.status(403).json({ status: 'error', message: 'Access denied. Admins only.' });
        }

        req.user = decoded; // Attach decoded user information to the request
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ status: 'error', message: 'Unauthorized. Invalid token.' });
    }
};

// Sample route
app.get('/', (req, res) => {
  res.send('API is working!');
});

app.options('*', cors());

// GET /api/members - Fetch all members with related next of kin and volunteering details
// app.get('/api/members', async (req, res) => {
//     try {
//         const query = `
//             SELECT 
//                 m.member_id,
//                 m.name,
//                 m.contact_info,
//                 m.date_of_birth,
//                 m.married_status,
//                 m.occupation_status,
//                 m.fellowship_ministries,
//                 m.service_ministries,
//                 m.baptized,
//                 m.conversion_date,
//                 m.is_full_member,
//                 m.is_visiting,
//                 m.location,
//                 m.county_of_origin,
//                 m.gender,
//                 m.discipleship_class_id,
//                 m.completed_class,
//                 m.membership_date,
//                 nk.first_name AS next_of_kin_first_name,
//                 nk.last_name AS next_of_kin_last_name,
//                 nk.contact_info AS next_of_kin_contact_info,
//                 v.volunteer_id,
//                 v.role AS volunteer_role
//             FROM 
//                 members m
//             LEFT JOIN 
//                 next_of_kin nk ON m.member_id = nk.member_id
//             LEFT JOIN 
//                 volunteers v ON m.member_id = v.member_id
//             ORDER BY 
//                 m.member_id ASC;
//         `;
//         const result = await pool.query(query);

//         // Transform the data to group related information
//         const members = {};

//         result.rows.forEach(row => {
//             if (!members[row.member_id]) {
//                 members[row.member_id] = {
//                     id: row.member_id,
//                     name: row.name,
//                     contactInfo: row.contact_info,
//                     dateOfBirth: row.date_of_birth,
//                     marriedStatus: row.married_status,
//                     occupationStatus: row.occupation_status,
//                     fellowshipMinistries: row.fellowship_ministries,
//                     serviceMinistries: row.service_ministries,
//                     baptized: row.baptized,
//                     conversionDate: row.conversion_date,
//                     isFullMember: row.is_full_member,
//                     isVisiting: row.is_visiting,
//                     location: row.location,
//                     countyOfOrigin: row.county_of_origin,
//                     gender: row.gender,
//                     discipleshipClassId: row.discipleship_class_id,
//                     completedClass: row.completed_class,
//                     membershipDate: row.membership_date,
//                     nextOfKin: row.next_of_kin_first_name ? {
//                         firstName: row.next_of_kin_first_name,
//                         lastName: row.next_of_kin_last_name,
//                         contactInfo: row.next_of_kin_contact_info,
//                     } : null,
//                     volunteering: row.volunteer_id ? {
//                         volunteerId: row.volunteer_id,
//                         role: row.volunteer_role,
//                     } : null,
//                 };
//             }
//         });

//         res.json(Object.values(members));
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching members' });
//     }
// });

// POST /api/members/add - Add a new member

// Adding memeber 
// Adding Member with changes to work with volunteers and ministries 
app.post('/api/members/add', async (req, res) => {
    const {
        sir_name,
        middle_name,
        last_name,
        date_of_birth,
        contact_info,
        gender,
        location,
        county_of_origin,
        occupation_status,
        married_status,
        is_visiting,
        is_full_member,
        baptized,
        conversion_date,
        discipleship_class_id,
        completed_class,
        next_of_kin,
        volunteering // Expected as an array of volunteering entries
    } = req.body;

    try {
        // Step 1: Get the next member_id
        const nextMemberIdResult = await pool.query(
            'SELECT COALESCE(MAX(member_id), 0) + 1 AS next_id FROM members'
        );
        const nextMemberId = nextMemberIdResult.rows[0].next_id;

        // Step 2: Insert member into the members table
        const memberQuery = `
            INSERT INTO members (
                member_id,
                name,
                contact_info,
                date_of_birth,
                married_status,
                occupation_status,
                fellowship_ministries,
                service_ministries,
                baptized,
                conversion_date,
                is_full_member,
                is_visiting,
                location,
                county_of_origin,
                gender,
                discipleship_class_id,
                completed_class,
                membership_date
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW())
            RETURNING member_id;
        `;

        const memberValues = [
            nextMemberId,
            `${sir_name} ${middle_name} ${last_name}`.trim(),
            contact_info,
            date_of_birth,
            married_status,
            occupation_status,
            volunteering
                .filter(v => v.ministry_type === 'Fellowship')
                .map(v => v.ministry_name)
                .join(', '), // Concatenate fellowship ministry names
            volunteering
                .filter(v => v.ministry_type === 'Service')
                .map(v => v.ministry_name)
                .join(', '), // Concatenate service ministry names
            !!baptized, // Convert to boolean
            conversion_date,
            !!is_full_member, // Convert to boolean
            !!is_visiting, // Convert to boolean
            location,
            county_of_origin,
            gender,
            discipleship_class_id,
            completed_class === true, // Ensure boolean value
        ];

        const memberResult = await pool.query(memberQuery, memberValues);
        const memberId = memberResult.rows[0].member_id;

        // Step 3: Insert next of kin into the next_of_kin table
        if (
            next_of_kin &&
            next_of_kin.first_name &&
            next_of_kin.last_name &&
            next_of_kin.contact_info
        ) {
            const nextOfKinQuery = `
                INSERT INTO next_of_kin (member_id, first_name, last_name, contact_info)
                VALUES ($1, $2, $3, $4);
            `;

            const nextOfKinValues = [
                memberId,
                next_of_kin.first_name,
                next_of_kin.last_name,
                next_of_kin.contact_info,
            ];

            await pool.query(nextOfKinQuery, nextOfKinValues);
        }

        // Step 4: Insert volunteering data into the volunteers and member_ministries tables
        if (Array.isArray(volunteering) && volunteering.length > 0) {
            for (const volunteerEntry of volunteering) {
                const { role, ministry_name, ministry_type } = volunteerEntry;

                if (role && ministry_name && ministry_type) {
                    const ministryQuery = `
                        SELECT ministry_id FROM ministries
                        WHERE ministry_name = $1 AND type = $2
                        LIMIT 1;
                    `;
                    const ministryValues = [ministry_name, ministry_type];
                    const ministryResult = await pool.query(ministryQuery, ministryValues);

                    if (ministryResult.rows.length > 0) {
                        const ministryId = ministryResult.rows[0].ministry_id;

                        // Insert into member_ministries table
                        const memberMinistryQuery = `
                            INSERT INTO member_ministries (member_id, ministry_id)
                            VALUES ($1, $2);
                        `;
                        await pool.query(memberMinistryQuery, [memberId, ministryId]);

                        // Insert into volunteers table
                        const nextVolunteerIdResult = await pool.query(
                            'SELECT COALESCE(MAX(volunteer_id), 0) + 1 AS next_id FROM volunteers'
                        );
                        const nextVolunteerId = nextVolunteerIdResult.rows[0].next_id;

                        const volunteeringQuery = `
                            INSERT INTO volunteers (volunteer_id, member_id, role, ministry_id)
                            VALUES ($1, $2, $3, $4);
                        `;

                        const volunteeringValues = [
                            nextVolunteerId,
                            memberId,
                            role,
                            ministryId,
                        ];
                        await pool.query(volunteeringQuery, volunteeringValues);
                    }
                }
            }
        }

        res.status(201).json({
            message: 'Member added successfully',
            memberId,
        });
    } catch (error) {
        console.error('Error adding member:', error.message);
        res.status(500).json({ error: 'Failed to add member' });
    }
});




// Get all members with pagination and optional search
app.get('/api/members', async (req, res) => {
    try {
        // Extract query parameters
        const { limit, offset, search } = req.query;

        // Set default values if not provided
        const limitVal = parseInt(limit, 10) || 20; // Default to 20 members per request
        const offsetVal = parseInt(offset, 10) || 0; // Default to start at 0

        // Base query
        let query = 'SELECT * FROM members';
        let countQuery = 'SELECT COUNT(*) FROM members';
        const values = [];
        const countValues = [];

        // If search term is provided, add WHERE clause
        if (search) {
            query += ' WHERE LOWER(name) LIKE $1';
            countQuery += ' WHERE LOWER(name) LIKE $1';
            const searchPattern = `%${search.toLowerCase()}%`;
            values.push(searchPattern);
            countValues.push(searchPattern);
        }

        // Add ORDER BY, LIMIT, OFFSET
        query += ' ORDER BY member_id ASC LIMIT $' + (values.length + 1) + ' OFFSET $' + (values.length + 2);
        values.push(limitVal);
        values.push(offsetVal);

        // Execute count query to get total number of members
        const countResult = await pool.query(countQuery, countValues);
        const total = parseInt(countResult.rows[0].count, 10);

        // Execute main query to get members
        const result = await pool.query(query, values);

        res.json({
            members: result.rows,
            total, // Total number of members matching the search criteria
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching members' });
    }
});


app.get('/api/members2', async (req, res) => {
    const { limit, lastMemberId } = req.query;

    const limitVal = parseInt(limit, 10) || 20; // Default to 20
    const cursor = lastMemberId ? parseInt(lastMemberId, 10) : null; // Use lastMemberId for cursor-based pagination

    try {
        let query = `
            SELECT *
            FROM members
            WHERE is_visiting = FALSE
        `;
        const params = [];

        // Add cursor-based pagination logic
        if (cursor) {
            query += ` AND member_id > $1`;
            params.push(cursor);
        }

        query += `
            ORDER BY member_id ASC
            LIMIT $${params.length + 1}
        `;
        params.push(limitVal);

        console.log('Executing query:', query, params); // Log the query and parameters

        const result = await pool.query(query, params);

        res.json({
            members: result.rows,
            hasMore: result.rows.length === limitVal, // Indicate if more rows are available
        });
    } catch (error) {
        console.error('Error fetching members:', error.message);
        res.status(500).json({ message: 'Error fetching members' });
    }
});


//Get all members count & allow yearmonth filter
app.get('/api/members/count', async (req, res) => {
    const { year, month } = req.query;
    try {
        let query = 'SELECT COUNT(*)::INTEGER AS total_members FROM members';
        let conditions = ["DATE_PART('year', AGE(date_of_birth)) >= 18"];

        if (year) conditions.push(`EXTRACT(YEAR FROM membership_date) = ${year}`);
        if (month) conditions.push(`EXTRACT(MONTH FROM membership_date) = ${month}`);
        
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
        
        const result = await pool.query(query);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// Total Number of Conversions & allow yearmonth filter
// Total Number of Conversions with optional year and month filters
app.get('/api/conversions/count', async (req, res) => {
    const { year, month } = req.query;
    try {
        let query = `
            SELECT COUNT(*)::INTEGER AS total_conversions 
            FROM members 
            WHERE conversion_date IS NOT NULL 
              AND DATE_PART('year', AGE(date_of_birth)) >= 18
        `;
        let conditions = [];

        // Apply year filter if provided
        if (year) conditions.push(`EXTRACT(YEAR FROM conversion_date) = ${year}`);

        // Apply month filter if provided
        if (month) conditions.push(`EXTRACT(MONTH FROM conversion_date) = ${month}`);

        // Add conditions to the query if there are any
        if (conditions.length > 0) {
            query += ' AND ' + conditions.join(' AND ');
        }

        const result = await pool.query(query);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// Total Number of Ministries
// Total Number of Ministries with optional year and month filters
app.get('/api/ministries/count', async (req, res) => {
    const { year, month } = req.query;
    try {
        let query = 'SELECT COUNT(*)::INTEGER AS total_ministries FROM ministries';
        let conditions = [];

        // Apply year filter if provided
        if (year) conditions.push(`EXTRACT(YEAR FROM creation_date) = ${year}`);

        // Apply month filter if provided
        if (month) conditions.push(`EXTRACT(MONTH FROM creation_date) = ${month}`);

        // Add conditions to the query if there are any
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        const result = await pool.query(query);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



// Total Number of Baptisms & allow yearmonth filter
// Total Number of Baptisms with optional year and month filters based on membership_date
app.get('/api/baptisms/count', async (req, res) => {
    const { year, month } = req.query;
    try {
        let query = "SELECT COUNT(*) ::INTEGER AS total_baptisms FROM members WHERE baptized = TRUE";
        let conditions = [];

        // Add year filter if provided, using membership_date instead
        if (year) conditions.push(`EXTRACT(YEAR FROM membership_date) = ${year}`);

        // Add month filter if provided, using membership_date instead
        if (month) conditions.push(`EXTRACT(MONTH FROM membership_date) = ${month}`);

        // Append conditions to query if there are any
        if (conditions.length > 0) {
            query += ' AND ' + conditions.join(' AND ');
        }

        const result = await pool.query(query);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



// Discipleship Classes Completed with optional year and month filters
app.get('/api/discipleship_classes/completed/count', async (req, res) => {
    const { year, month } = req.query;
    try {
        let query = "SELECT COUNT(*) ::INTEGER AS completed_classes FROM discipleship_classes WHERE end_date IS NOT NULL";
        let conditions = [];

        // Add year filter if provided
        if (year) conditions.push(`EXTRACT(YEAR FROM end_date) = ${year}`);

        // Add month filter if provided
        if (month) conditions.push(`EXTRACT(MONTH FROM end_date) = ${month}`);

        // Append conditions to query if there are any
        if (conditions.length > 0) {
            query += ' AND ' + conditions.join(' AND ');
        }

        const result = await pool.query(query);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// Church Staff Count & allow yearmonth filter
app.get('/api/staff/count', async (req, res) => {
    const { year, month } = req.query;
    try {
        let query = `SELECT COUNT(*)::INTEGER AS total_staff FROM users WHERE role IN ('Pastor', 'Admin', 'Leader')`;
        let conditions = [];

        if (year) conditions.push(`EXTRACT(YEAR FROM date_created) = ${year}`);
        if (month) conditions.push(`EXTRACT(MONTH FROM date_created) = ${month}`);

        if (conditions.length > 0) {
            query += ' AND ' + conditions.join(' AND ');
        }

        const result = await pool.query(query);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//Age distribution 
app.get('/api/members/age-distribution', async (req, res) => {
    try {
        const query = `
            SELECT
                CASE
                    WHEN DATE_PART('year', AGE(date_of_birth)) BETWEEN 0 AND 17 THEN '0-17'
                    WHEN DATE_PART('year', AGE(date_of_birth)) BETWEEN 18 AND 25 THEN '18-25'
                    WHEN DATE_PART('year', AGE(date_of_birth)) BETWEEN 26 AND 35 THEN '26-35'
                    WHEN DATE_PART('year', AGE(date_of_birth)) BETWEEN 36 AND 49 THEN '36-49'
                    WHEN DATE_PART('year', AGE(date_of_birth)) BETWEEN 50 AND 64 THEN '50-64'
                    WHEN DATE_PART('year', AGE(date_of_birth)) >= 65 THEN '65+'
                END AS age_range,
                COUNT(*) ::INTEGER AS count
            FROM members
            GROUP BY age_range
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});


// work status 
app.get('/api/members/work-status', async (req, res) => {
    const { year, month } = req.query;
    try {
        let query = `
            SELECT occupation_status, COUNT(*)::INTEGER AS count
            FROM members
            WHERE DATE_PART('year', AGE(date_of_birth)) >= 18
        `;
        const conditions = [];
        
        if (year) conditions.push(`EXTRACT(YEAR FROM membership_date) = ${year}`);
        if (month) conditions.push(`EXTRACT(MONTH FROM membership_date) = ${month}`);
        
        if (conditions.length > 0) {
            query += ' AND ' + conditions.join(' AND ');
        }
        
        query += ` GROUP BY occupation_status ORDER BY count ASC`;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});



//gender distribution 
app.get('/api/members/gender-distribution', async (req, res) => {
    const { year, month } = req.query;
    try {
        let query = `
            SELECT gender, COUNT(*)::INTEGER AS count
            FROM members
            WHERE DATE_PART('year', AGE(date_of_birth)) >= 18
        `;
        const conditions = [];
        
        if (year) conditions.push(`EXTRACT(YEAR FROM membership_date) = ${year}`);
        if (month) conditions.push(`EXTRACT(MONTH FROM membership_date) = ${month}`);
        
        if (conditions.length > 0) {
            query += ' AND ' + conditions.join(' AND ');
        }
        
        query += ` GROUP BY gender`;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

//marital status
app.get('/api/members/marital-status', async (req, res) => {
    const { year, month } = req.query;
    try {
        let query = `
            SELECT 
                married_status,
                COUNT(*)::INTEGER AS count
            FROM members
            WHERE DATE_PART('year', AGE(date_of_birth)) >= 18
        `;
        const conditions = [];
        
        if (year) conditions.push(`EXTRACT(YEAR FROM membership_date) = ${year}`);
        if (month) conditions.push(`EXTRACT(MONTH FROM membership_date) = ${month}`);
        
        if (conditions.length > 0) {
            query += ' AND ' + conditions.join(' AND ');
        }
        
        query += ` GROUP BY married_status ORDER BY count ASC`;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});


// residence 
app.get('/api/members/residence', async (req, res) => {
    const { year, month } = req.query;
    try {
        let query = `
            SELECT location AS residence, COUNT(*)::INTEGER AS count
            FROM members
            WHERE DATE_PART('year', AGE(date_of_birth)) >= 18
        `;
        const conditions = [];
        
        if (year) conditions.push(`EXTRACT(YEAR FROM membership_date) = ${year}`);
        if (month) conditions.push(`EXTRACT(MONTH FROM membership_date) = ${month}`);
        
        if (conditions.length > 0) {
            query += ' AND ' + conditions.join(' AND ');
        }
        
        query += ` GROUP BY location`;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});



// country of orgin 
app.get('/api/members/county-origin', async (req, res) => {
    const { year, month } = req.query;
    try {
        let query = `
            SELECT county_of_origin, COUNT(*)::INTEGER AS count
            FROM members
            WHERE DATE_PART('year', AGE(date_of_birth)) >= 18
        `;
        const conditions = [];
        
        if (year) conditions.push(`EXTRACT(YEAR FROM membership_date) = ${year}`);
        if (month) conditions.push(`EXTRACT(MONTH FROM membership_date) = ${month}`);
        
        if (conditions.length > 0) {
            query += ' AND ' + conditions.join(' AND ');
        }
        
        query += ` GROUP BY county_of_origin`;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});


//memebrs monthly 

app.get('/api/members/monthly', async (req, res) => {
    let { year } = req.query;

    // Default to the current year if no year is provided
    if (!year) {
        year = new Date().getFullYear();
    }

    try {
        const query = `
            SELECT 
                TO_CHAR(membership_date, 'Mon') AS month,
                EXTRACT(MONTH FROM membership_date) AS month_number,
                COUNT(*)::INTEGER AS count,
                COUNT(CASE WHEN gender = 'Male' THEN 1 END)::INTEGER AS male_count,
                COUNT(CASE WHEN gender = 'Female' THEN 1 END)::INTEGER AS female_count
            FROM members
            WHERE EXTRACT(YEAR FROM membership_date) = $1
                AND DATE_PART('year', AGE(date_of_birth)) >= 18
            GROUP BY month, month_number
            ORDER BY month_number
        `;
        const result = await pool.query(query, [year]);
        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// bap monthly 
app.get('/api/baptisms/monthly', async (req, res) => {
    const { year } = req.query;
    try {
        let query = `
            SELECT 
                TO_CHAR(conversion_date, 'Mon') AS month,
                EXTRACT(MONTH FROM conversion_date) ::INTEGER  AS month_number,
                COUNT(*) ::INTEGER AS count,
                COUNT(CASE WHEN gender = 'Male' THEN 1 END) ::INTEGER AS male_count,
                COUNT(CASE WHEN gender = 'Female' THEN 1 END) ::INTEGER AS female_count
            FROM members
            WHERE baptized = TRUE
                AND DATE_PART('year', AGE(date_of_birth)) >= 18
        `;

        // Add the year condition 
        if (year) {
            query += ` AND EXTRACT(YEAR FROM conversion_date) = ${year}`;
        }

        query += `
            GROUP BY month, month_number
            ORDER BY month_number
        `;

        const result = await pool.query(query);
        // Format the result to match your desired output
        const formattedResult = result.rows.map(row => ({
            month: row.month,
            month_number: row.month_number,
            count: row.count,
            male_count: row.male_count,
            female_count: row.female_count
        }));

        res.json(formattedResult);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// member residence for testing 
app.get('/api/members/residence3', async (req, res) => {
    const { year, month } = req.query;
    try {
        let query = `
            SELECT location AS residence, COUNT(*)::INTEGER AS count
            FROM members
            WHERE DATE_PART('year', AGE(date_of_birth)) >= 18
        `;
        const conditions = [];

        if (year) conditions.push(`EXTRACT(YEAR FROM membership_date) = ${year}`);
        if (month) conditions.push(`EXTRACT(MONTH FROM membership_date) = ${month}`);

        if (conditions.length > 0) {
            query += ' AND ' + conditions.join(' AND ');
        }

        query += ` GROUP BY location LIMIT 6`;

        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// members who are just visting 
app.get('/api/just-visiting', async (req, res) => {
    const { year, month, startDate, endDate } = req.query;

    try {
        let query = `
            SELECT COUNT(*)::INTEGER AS total_visitors
            FROM members m
            WHERE m.is_visiting = TRUE
              AND DATE_PART('year', AGE(date_of_birth)) >= 18
        `;
        const conditions = [];

        // Filter by startDate and endDate if provided
        if (startDate) conditions.push(`m.membership_date >= '${startDate}'::DATE`);
        if (endDate) conditions.push(`m.membership_date <= '${endDate}'::DATE`);

        // Filter by year and month if provided
        if (year) conditions.push(`EXTRACT(YEAR FROM m.membership_date) = ${year}`);
        if (month) conditions.push(`EXTRACT(MONTH FROM m.membership_date) = ${month}`);

        if (conditions.length > 0) {
            query += ' AND ' + conditions.join(' AND ');
        }

        const result = await pool.query(query);
        res.json({
            status: 'success',
            data: { total_visitors: result.rows[0].total_visitors }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});


// retentation rate by month 
app.get('/api/retention-rate', async (req, res) => {
    const { year } = req.query;

    try {
        let query = `
            SELECT
                TO_CHAR(dc.start_date, 'YYYY-MM-DD') AS start_date, -- Use full date
                COUNT(DISTINCT m.member_id)::INTEGER AS total_members,
                COUNT(DISTINCT CASE WHEN m.completed_class = TRUE THEN m.member_id END)::INTEGER AS completed_members,
                COUNT(DISTINCT CASE WHEN m.completed_class = FALSE THEN m.member_id END)::INTEGER AS dropped_out_members,
                COUNT(DISTINCT CASE WHEN m.completed_class = TRUE AND m.gender = 'Male' THEN m.member_id END)::INTEGER AS male_completed,
                COUNT(DISTINCT CASE WHEN m.completed_class = TRUE AND m.gender = 'Female' THEN m.member_id END)::INTEGER AS female_completed,
                ROUND(
                    COUNT(DISTINCT CASE WHEN m.completed_class = TRUE THEN m.member_id END)::decimal /
                    NULLIF(COUNT(DISTINCT m.member_id), 0) * 100, 2
                ) AS retention_rate
            FROM
                discipleship_classes dc
            LEFT JOIN members m ON m.discipleship_class_id = dc.class_id
            WHERE
                m.is_visiting = FALSE -- Exclude visiting members
                AND DATE_PART('year', AGE(m.date_of_birth)) >= 18 -- Only members aged 18 or older
        `;

        if (year) {
            query += ` AND EXTRACT(YEAR FROM dc.start_date) = ${year}`;
        }

        query += `
            GROUP BY
                TO_CHAR(dc.start_date, 'YYYY-MM-DD') -- Group by full date
            ORDER BY
                start_date; -- Order by the full date
        `;

        const result = await pool.query(query);

        res.json({ status: 'success', data: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});

 // overall-retention rate  
 app.get('/api/overall-retention-rate', async (req, res) => {
    const { year } = req.query;

    try {
        let query = `
            SELECT
                COUNT(DISTINCT m.member_id) AS total_members,
                COUNT(DISTINCT CASE WHEN m.completed_class = TRUE THEN m.member_id END)::INTEGER AS completed_members,
                COUNT(DISTINCT CASE WHEN m.completed_class = FALSE THEN m.member_id END)::INTEGER AS dropped_out_members,
                ROUND(
                    COUNT(DISTINCT CASE WHEN m.completed_class = TRUE THEN m.member_id END)::decimal /
                    NULLIF(COUNT(DISTINCT m.member_id), 0) * 100, 2
                ) AS overall_retention_rate
            FROM
                members m
            WHERE
                m.discipleship_class_id IS NOT NULL
                AND m.is_visiting = FALSE -- Exclude visiting members
                AND DATE_PART('year', AGE(m.date_of_birth)) >= 18 -- Only members aged 18 or older
        `;

        // Add year filter if provided
        if (year) {
            query += ` AND EXTRACT(YEAR FROM m.membership_date) = ${year}`;
        }

        const result = await pool.query(query);

        res.json({
            status: 'success',
            data: {
                total_members: result.rows[0].total_members,
                completed_members: result.rows[0].completed_members,
                dropped_out_members: result.rows[0].dropped_out_members,
                overall_retention_rate: result.rows[0].overall_retention_rate
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});

 
// Getting all discipleship classes with total member count
app.get('/api/discipleship-classes2', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                dc.class_id,
                dc.class_name,
                dc.instructor,
                COUNT(
                    CASE 
                        WHEN m.is_visiting = FALSE 
                             AND DATE_PART('year', AGE(m.date_of_birth)) >= 18 THEN m.member_id
                    END
                )::INTEGER AS total_members
            FROM
                discipleship_classes dc
            LEFT JOIN members m ON dc.class_id = m.discipleship_class_id
            GROUP BY
                dc.class_id, dc.class_name, dc.instructor
            ORDER BY
                dc.class_id;
        `);

        res.json({ status: 'success', data: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});




//generateUniqueClassName
app.get('/api/generate-class-name', async (req, res) => {
    const prefix = "ICC";
    let className;
    let isUnique = false;
  
    try {
      while (!isUnique) {
        const number = Math.floor(Math.random() * 100) + 100; // Random number between 100 and 199
        className = `${prefix}${number}`;
  
        // Query the database to check if this class name already exists
        const result = await pool.query(
          `SELECT COUNT(*) FROM discipleship_classes WHERE class_name = $1`,
          [className]
        );
  
        if (parseInt(result.rows[0].count, 10) === 0) {
          isUnique = true; // Name is unique
        }
      }
  
      res.status(200).json({ className }); // Send the unique class name
    } catch (error) {
      console.error("Error generating class name:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  

// Add Discipleship Class API
// Add Discipleship Class API with class days  changed  to INEGER
app.post('/api/discipleship-classes_add', async (req, res) => {
    const { class_name, instructor, creation_date, end_date, description, type, class_time, class_day } = req.body;

    // Validate request body
    if (!class_name || !instructor || !creation_date || !end_date || !type || !class_time || class_day == null) {
        return res.status(400).json({ status: 'error', message: 'Missing required fields' });
    }

    // Validate 'type' value
    if (!['Virtual', 'Physical'].includes(type)) {
        return res.status(400).json({ status: 'error', message: "Type must be either 'Virtual' or 'Physical'" });
    }

    // Validate 'class_day' as a number between 1 and 7
    if (!Number.isInteger(class_day) || class_day < 1 || class_day > 7) {
        return res.status(400).json({ status: 'error', message: 'Class day must be an integer between 1 (Monday) and 7 (Sunday)' });
    }

    try {
        // Get the current maximum class_id
        const maxIdResult = await pool.query(`SELECT MAX(class_id) AS max_id FROM discipleship_classes;`);
        const nextClassId = (maxIdResult.rows[0].max_id || 0) + 1; // Default to 1 if table is empty

        // Insert the new class with status = 'ongoing'
        const result = await pool.query(
            `INSERT INTO discipleship_classes (class_id, class_name, instructor, start_date, end_date, description, type, class_time, class_day, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
             RETURNING *;`,
            [nextClassId, class_name, instructor, creation_date, end_date, description || null, type, class_time, class_day, 'ongoing']
        );

        res.status(201).json({
            status: 'success',
            message: 'Discipleship class added successfully',
            data: result.rows[0],
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});


//Fetching Absentees(still being worked on)
app.get('/api/absentees-list', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                TO_CHAR(a.date, 'YYYY-MM') AS month,
                COUNT(*) AS total_absentees,
                COUNT(CASE WHEN m.gender = 'Male' THEN 1 END) AS male_absentees,
                COUNT(CASE WHEN m.gender = 'Female' THEN 1 END) AS female_absentees
            FROM
                attendance a
            JOIN members m ON a.member_id = m.member_id
            WHERE
                a.status = 'Absent'
            GROUP BY
                TO_CHAR(a.date, 'YYYY-MM')
            ORDER BY
                month;
        `);

        res.status(200).json({
            status: 'success',
            data: result.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});

// discipleship class Monthly Completion Stats (Age) with year filter 
app.get('/api/monthly-completed-stats', async (req, res) => {
    const { year } = req.query; // Get year from query parameter

    // Use the current year if no year is specified
    const currentYear = new Date().getFullYear();
    const targetYear = year ? parseInt(year, 10) : currentYear;

    try {
        const result = await pool.query(`
            SELECT
                TO_CHAR(m.membership_date, 'YYYY-MM') AS month,
                CASE
                    WHEN DATE_PART('year', AGE(m.date_of_birth)) BETWEEN 18 AND 25 THEN '18-25'
                    WHEN DATE_PART('year', AGE(m.date_of_birth)) BETWEEN 26 AND 35 THEN '26-35'
                    WHEN DATE_PART('year', AGE(m.date_of_birth)) BETWEEN 36 AND 49 THEN '36-49'
                    WHEN DATE_PART('year', AGE(m.date_of_birth)) BETWEEN 50 AND 64 THEN '50-64'
                    WHEN DATE_PART('year', AGE(m.date_of_birth)) >= 65 THEN '65+'
                END AS age_group,
                COUNT(CASE WHEN m.completed_class = TRUE AND m.gender = 'Male' THEN 1 END)::INTEGER AS male_completed_count,
                COUNT(CASE WHEN m.completed_class = TRUE AND m.gender = 'Female' THEN 1 END)::INTEGER AS female_completed_count
            FROM
                members m
            WHERE
                m.discipleship_class_id IS NOT NULL
                AND m.is_visiting = FALSE -- Exclude visiting members
                AND DATE_PART('year', AGE(m.date_of_birth)) >= 18 -- Include only members aged 18+
                AND EXTRACT(YEAR FROM m.membership_date) = $1
            GROUP BY
                TO_CHAR(m.membership_date, 'YYYY-MM'),
                age_group
            ORDER BY
                month, age_group;
        `, [targetYear]); // Pass the target year to the query

        res.status(200).json({
            status: 'success',
            data: result.rows,
            year: targetYear // Include the year in the response
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});


// fellowship ministry
app.get('/api/fellowship-members-per-month', async (req, res) => {
    const { ministryName } = req.query;

    if (!ministryName) {
        return res.status(400).json({ 
            status: 'error', 
            message: 'Ministry name is required. Please provide a ministry name as a query parameter.' 
        });
    }

    try {
        const result = await pool.query(`
            SELECT
                TO_CHAR(m.membership_date, 'YYYY-MM') AS month,
                COUNT(m.member_id) AS member_count
            FROM
                members m
            JOIN ministries min ON m.assigned_ministry_id = min.ministry_id
            WHERE
                min.ministry_name = $1
            GROUP BY
                TO_CHAR(m.membership_date, 'YYYY-MM')
            ORDER BY
                month;
        `, [ministryName]);

        res.status(200).json({
            status: 'success',
            data: result.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});


// Age distribution based on completed and not completed discipleship classes
app.get('/api/members/age-distribution-dis', async (req, res) => {
    const { year } = req.query; // Get the year from the query parameters

    try {
        // Validate year: It must be an integer if provided
        if (year && isNaN(parseInt(year, 10))) {
            return res.status(400).json({ status: 'error', message: 'Invalid year parameter' });
        }

        // Build query with optional year filter
        const query = `
            SELECT
                EXTRACT(YEAR FROM m.membership_date)::INTEGER AS year, -- Cast year to INTEGER
                CASE
                    WHEN DATE_PART('year', AGE(m.date_of_birth)) BETWEEN 18 AND 25 THEN '18-25'
                    WHEN DATE_PART('year', AGE(m.date_of_birth)) BETWEEN 26 AND 35 THEN '26-35'
                    WHEN DATE_PART('year', AGE(m.date_of_birth)) BETWEEN 36 AND 49 THEN '36-49'
                    WHEN DATE_PART('year', AGE(m.date_of_birth)) BETWEEN 50 AND 64 THEN '50-64'
                    WHEN DATE_PART('year', AGE(m.date_of_birth)) >= 65 THEN '65+'
                END AS age_range,
                COUNT(CASE WHEN m.completed_class = TRUE AND m.gender = 'Male' THEN 1 END)::INTEGER AS male_completed_count,
                COUNT(CASE WHEN m.completed_class = TRUE AND m.gender = 'Female' THEN 1 END)::INTEGER AS female_completed_count,
                COUNT(CASE WHEN m.completed_class = FALSE AND m.gender = 'Male' THEN 1 END)::INTEGER AS male_not_completed_count,
                COUNT(CASE WHEN m.completed_class = FALSE AND m.gender = 'Female' THEN 1 END)::INTEGER AS female_not_completed_count
            FROM
                members m
            WHERE
                m.is_visiting = FALSE -- Exclude visiting members
                AND DATE_PART('year', AGE(m.date_of_birth)) >= 18 -- Only include members aged 18+
                ${year ? 'AND EXTRACT(YEAR FROM m.membership_date) = $1' : ''} -- Filter by year if provided
            GROUP BY
                year, age_range
            ORDER BY
                year, age_range;
        `;

        // Execute query with or without year parameter
        const result = year
            ? await pool.query(query, [parseInt(year, 10)]) // Pass year as integer
            : await pool.query(query); // Execute without year filter

        res.json({
            status: 'success',
            data: result.rows,
            year: year ? parseInt(year, 10) : 'All Years' // Include year info
        });
    } catch (error) {
        console.error('Error fetching member data:', error.message);
        res.status(500).send('Server Error');
    }
});


// Age distribution based on completed and not completed discipleship classes, grouped by year and age group
app.get('/api/members-dis/age-distribution-dis2', async (req, res) => {
    const { year } = req.query; // Get the year from the query parameters

    // Use the current year if no year is provided
    const currentYear = new Date().getFullYear();
    const targetYear = year ? parseInt(year, 10) : currentYear;

    try {
        const query = `
            SELECT
                EXTRACT(YEAR FROM m.membership_date):: INTEGER AS year,
                CASE
                    WHEN DATE_PART('year', AGE(m.date_of_birth)) BETWEEN 18 AND 25 THEN '18-25'
                    WHEN DATE_PART('year', AGE(m.date_of_birth)) BETWEEN 26 AND 35 THEN '26-35'
                    WHEN DATE_PART('year', AGE(m.date_of_birth)) BETWEEN 36 AND 49 THEN '36-49'
                    WHEN DATE_PART('year', AGE(m.date_of_birth)) BETWEEN 50 AND 64 THEN '50-64'
                    WHEN DATE_PART('year', AGE(m.date_of_birth)) >= 65 THEN '65+'
                END AS age_range,
                COUNT(CASE WHEN m.completed_class = TRUE AND m.gender = 'Male' THEN 1 END)::INTEGER AS male_completed_count,
                COUNT(CASE WHEN m.completed_class = TRUE AND m.gender = 'Female' THEN 1 END)::INTEGER AS female_completed_count,
                COUNT(CASE WHEN m.completed_class = FALSE AND m.gender = 'Male' THEN 1 END)::INTEGER AS male_not_completed_count,
                COUNT(CASE WHEN m.completed_class = FALSE AND m.gender = 'Female' THEN 1 END)::INTEGER AS female_not_completed_count
            FROM
                members m
            WHERE
                m.is_visiting = FALSE -- Exclude visiting members
                AND DATE_PART('year', AGE(m.date_of_birth)) >= 18 -- Only include members aged 18+
                AND EXTRACT(YEAR FROM m.membership_date) = $1 -- Filter by target year
            GROUP BY
                year, age_range
            ORDER BY
                year, age_range;
        `;

        const result = await pool.query(query, [targetYear]); // Pass the target year to the query
        res.json({
            status: 'success',
            data: result.rows,
            year: targetYear // Include the year in the response
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});


// work status distribution-discipleship classes
app.get('/api/members/work-status-dis', async (req, res) => {
    const { year } = req.query; // Get the year from the query parameters

    try {
        const query = `
            SELECT 
                occupation_status,
                COUNT(CASE WHEN completed_class = TRUE AND gender = 'Male' THEN 1 END)::INTEGER AS male_completed_count,
                COUNT(CASE WHEN completed_class = TRUE AND gender = 'Female' THEN 1 END)::INTEGER AS female_completed_count,
                COUNT(CASE WHEN completed_class = FALSE AND gender = 'Male' THEN 1 END)::INTEGER AS male_not_completed_count,
                COUNT(CASE WHEN completed_class = FALSE AND gender = 'Female' THEN 1 END)::INTEGER AS female_not_completed_count
            FROM 
                members
            WHERE 
                is_visiting = FALSE -- Exclude visiting members
                AND DATE_PART('year', AGE(date_of_birth)) >= 18 -- Include only members aged 18+
                ${year ? `AND EXTRACT(YEAR FROM membership_date) = ${year}` : ''} -- Filter by year if provided
            GROUP BY 
                occupation_status
            ORDER BY 
                occupation_status;
        `;

        const result = await pool.query(query);
        res.json({
            status: 'success',
            data: result.rows,
            year: year || 'All Years' // Include the year or indicate "All Years"
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});


//service list 
// Service ministries list with member filtering
// Service ministries list with member filtering: using new member_minstries
app.get('/api/service-ministries', async (req, res) => {
    const { year } = req.query; // Get the year from the query parameters

    try {
        const query = `
            SELECT
                min.ministry_id,
                min.ministry_name,
                min.leader_name AS instructor,
                COUNT(
                    CASE
                        WHEN m.is_visiting = FALSE
                             AND DATE_PART('year', AGE(m.date_of_birth)) >= 18
                             ${year ? `AND EXTRACT(YEAR FROM m.membership_date) = ${year}` : ''}
                        THEN m.member_id
                    END
                )::INTEGER AS total_members
            FROM
                ministries min
            LEFT JOIN member_ministries mm ON min.ministry_id = mm.ministry_id
            LEFT JOIN members m ON mm.member_id = m.member_id
            WHERE
                min.type = 'Service'
            GROUP BY
                min.ministry_id, min.ministry_name, min.leader_name
            ORDER BY
                min.ministry_id;
        `;

        const result = await pool.query(query);
        res.json({
            status: 'success',
            data: result.rows,
            year: year || 'All Years' // Include the year or indicate "All Years"
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});


// age distribution 
// Age distribution for service ministries
// Age Distribution for Service Ministries with change to use new member_minstries
app.get('/api/service-ministries/age-distribution', async (req, res) => {
    const { year } = req.query; // Get the year from the query parameters

    try {
        const query = `
            SELECT
                min.ministry_name,
                CASE
                    WHEN DATE_PART('year', AGE(m.date_of_birth)) BETWEEN 18 AND 25 THEN '18-25'
                    WHEN DATE_PART('year', AGE(m.date_of_birth)) BETWEEN 26 AND 35 THEN '26-35'
                    WHEN DATE_PART('year', AGE(m.date_of_birth)) BETWEEN 36 AND 49 THEN '36-49'
                    WHEN DATE_PART('year', AGE(m.date_of_birth)) BETWEEN 50 AND 64 THEN '50-64'
                    WHEN DATE_PART('year', AGE(m.date_of_birth)) >= 65 THEN '65+'
                    ELSE 'Unknown'
                END AS age_range,
                COUNT(m.member_id)::INTEGER AS total
            FROM
                ministries min
            LEFT JOIN member_ministries mm ON min.ministry_id = mm.ministry_id
            LEFT JOIN members m ON mm.member_id = m.member_id
            WHERE
                min.type = 'Service' -- Only service ministries
                AND m.is_visiting = FALSE -- Exclude visiting members
                AND DATE_PART('year', AGE(m.date_of_birth)) >= 18 -- Include only members aged 18+
                ${year ? `AND EXTRACT(YEAR FROM m.membership_date) = ${year}` : ''} -- Filter by year if provided
            GROUP BY
                min.ministry_name, age_range
            ORDER BY
                min.ministry_name, age_range;
        `;

        const result = await pool.query(query);
        res.json({
            status: 'success',
            data: result.rows,
            year: year || 'All Years' // Include year or indicate "All Years"
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});


// work status service
// Work status distribution for service ministries
// Work Status Distribution for Service Ministries with change to use new member_minstries
app.get('/api/service-ministries/work-status', async (req, res) => {
    const { year } = req.query; // Get the year from the query parameters

    try {
        const query = `
            SELECT
                min.ministry_name,
                m.occupation_status,
                COUNT(CASE WHEN m.gender = 'Male' THEN 1 END)::INTEGER AS male_count,
                COUNT(CASE WHEN m.gender = 'Female' THEN 1 END)::INTEGER AS female_count
            FROM
                ministries min
            LEFT JOIN member_ministries mm ON min.ministry_id = mm.ministry_id
            LEFT JOIN members m ON mm.member_id = m.member_id
            WHERE
                min.type = 'Service' -- Only service ministries
                AND m.is_visiting = FALSE -- Exclude visiting members
                AND DATE_PART('year', AGE(m.date_of_birth)) >= 18 -- Include only members aged 18+
                ${year ? `AND EXTRACT(YEAR FROM m.membership_date) = ${year}` : ''} -- Filter by year if provided
            GROUP BY
                min.ministry_name, m.occupation_status
            ORDER BY
                min.ministry_name,
                COUNT(CASE WHEN m.gender = 'Male' THEN 1 END) + COUNT(CASE WHEN m.gender = 'Female' THEN 1 END) DESC; -- Use expression in ORDER BY
        `;

        const result = await pool.query(query);
        res.json({
            status: 'success',
            data: result.rows,
            year: year || 'All Years' // Include year or indicate "All Years"
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});



// update the discipleship-classes end-date 
app.put('/api/discipleship-classes/:id/end-date', async (req, res) => {
    const { id } = req.params;
    const { end_date } = req.body;

    try {
        // Update end_date and status based on the new end_date
        const result = await pool.query(`
            UPDATE discipleship_classes
            SET end_date = $1,
                status = CASE
                    WHEN $1 < CURRENT_DATE THEN 'completed'
                    ELSE 'ongoing'
                END
            WHERE class_id = $2
            RETURNING *;
        `, [end_date, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Class not found' });
        }

        res.json({ status: 'success', data: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});



// update discipleship-classes meeting times 
app.put('/api/discipleship-classes/:id/time', async (req, res) => {
    const { id } = req.params;
    const { class_time } = req.body;

    if (!class_time) {
        return res.status(400).json({ status: 'error', message: 'Class time is required' });
    }

    try {
        const result = await pool.query(`
            UPDATE discipleship_classes
            SET class_time = $1
            WHERE class_id = $2
            RETURNING *;
        `, [class_time, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Class not found' });
        }

        res.json({ status: 'success', data: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});


// update discipleship-classes days 
app.put('/api/discipleship-classes/:id/days', async (req, res) => {
    const { id } = req.params;
    const { class_days } = req.body;

    if (!Array.isArray(class_days) || class_days.length === 0) {
        return res.status(400).json({ status: 'error', message: 'Class days must be a non-empty array' });
    }

    try {
        const result = await pool.query(`
            UPDATE discipleship_classes
            SET class_days = $1
            WHERE class_id = $2
            RETURNING *;
        `, [class_days, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Class not found' });
        }

        res.json({ status: 'success', data: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});

// Check the available disclipship classes
app.get('/api/available-classes', async (req, res) => {
    const { days } = req.query; // Number of days passed as query parameter
    const intervalDays = days ? parseInt(days, 10) : 10; // Default to 10 days if not provided

    if (isNaN(intervalDays) || intervalDays < 0) {
        return res.status(400).json({ status: 'error', message: 'Invalid number of days' });
    }

    try {
        const result = await pool.query(`
            SELECT
                class_id,
                class_name,
                instructor,
                start_date,
                end_date,
                status
            FROM
                discipleship_classes
            WHERE
                status = 'ongoing'
                AND start_date >= CURRENT_DATE - $1 * INTERVAL '1 day';
        `, [intervalDays]);

        res.status(200).json({
            status: 'success',
            data: result.rows,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});

// api for updating start_date (for testing only): DO NOT USE **** DO NOT USE 

app.put('/api/discipleship-classes/:id/start-date', async (req, res) => {
    const { id } = req.params;
    const { start_date } = req.body;

    if (!start_date) {
        return res.status(400).json({ status: 'error', message: 'Start date is required' });
    }

    try {
        const result = await pool.query(`
            UPDATE discipleship_classes
            SET start_date = $1
            WHERE class_id = $2
            RETURNING *;
        `, [start_date, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Class not found' });
        }

        res.status(200).json({
            status: 'success',
            message: 'Start date updated successfully',
            data: result.rows[0],
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});

// Volunteers API
// Volunteers API with Year Filter and Exclude Visiting Members
app.get('/api/volunteers', async (req, res) => {
    const { year } = req.query; // Get the year from query parameters

    try {
        const query = `
            SELECT
                v.volunteer_id,
                m.name AS member_name,
                v.role,
                min.ministry_name
            FROM
                volunteers v
            JOIN members m ON v.member_id = m.member_id
            JOIN member_ministries mm ON m.member_id = mm.member_id
            JOIN ministries min ON mm.ministry_id = min.ministry_id
            WHERE
                m.is_visiting = FALSE -- Exclude visiting members
                ${year ? `AND EXTRACT(YEAR FROM m.membership_date) = ${year}` : ''} -- Filter by year if provided
            ORDER BY
                min.ministry_name, v.role;
        `;

        const result = await pool.query(query);
        res.json({
            status: 'success',
            data: result.rows,
            year: year || 'All Years', // Include the year or indicate "All Years"
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});

// Example: GET /api/ministries?type=Fellowship
// Returns an array of ministry names for the given type.

app.get('/api/ministries', async (req, res) => {
    const { type } = req.query;

    if (!type) {
        return res.status(400).json({ error: 'Type query parameter is required (e.g., ?type=Fellowship)' });
    }

    try {
        const result = await pool.query(
            'SELECT ministry_name FROM ministries WHERE type = $1',
            [type]
        );

        const ministries = result.rows.map(row => row.ministry_name);
        res.json(ministries);
    } catch (error) {
        console.error('Error fetching ministries:', error);
        res.status(500).json({ error: 'Failed to fetch ministries' });
    }
});




// Total Count of Volunteers API
// Total Count of Volunteers API with Year Filter and Exclude Visiting Members
app.get('/api/volunteers/total-count', async (req, res) => {
    const { year } = req.query; // Get the year from query parameters

    try {
        const query = `
            SELECT
                min.ministry_name,
                COUNT(v.volunteer_id)::INTEGER AS total_volunteers
            FROM
                volunteers v
            JOIN members m ON v.member_id = m.member_id
            JOIN member_ministries mm ON m.member_id = mm.member_id
            JOIN ministries min ON mm.ministry_id = min.ministry_id
            WHERE
                m.is_visiting = FALSE -- Exclude visiting members
                ${year ? `AND EXTRACT(YEAR FROM m.membership_date) = ${year}` : ''} -- Filter by year if provided
            GROUP BY
                min.ministry_name
            ORDER BY
                total_volunteers DESC;
        `;

        const result = await pool.query(query);
        res.json({
            status: 'success',
            data: result.rows,
            year: year || 'All Years', // Include the year or indicate "All Years"
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});

// Login API with Role Validation
app.post('/api/users/login', cors(), async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ status: 'error', message: 'Email and password are required' });
    }

    try {
        // Fetch user by contact_details (email)
        const userQuery = `
            SELECT user_id, contact_details AS email, password, role
            FROM users
            WHERE contact_details = $1
        `;
        const userResult = await pool.query(userQuery, [email]);

        if (userResult.rows.length === 0) {
            return res.status(401).json({ status: 'error', message: 'Invalid email or password' });
        }

        const user = userResult.rows[0];

        // Check if the user has a valid role
        const allowedRoles = ['Admin', 'Pastor', 'Leader', 'usher', 'instructor' ];
        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({ status: 'error', message: 'Access denied. Invalid role.' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ status: 'error', message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.user_id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            data: {
                user_id: user.user_id,
                email: user.email,
                role: user.role,
                token
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});



// Create User API Restricted to Admins
app.post('/api/users/create', authenticateAdmin, async (req, res) => {
    const { userfname, password, role, contact_details, phone_no } = req.body;

    // Validate input
    if (!userfname || !password || !role || !contact_details || !phone_no) {
        return res.status(400).json({ status: 'error', message: 'All fields are required' });
    }

    // Validate role
    const allowedRoles = ['Admin', 'Pastor', 'Leader', 'usher', 'instructor'];
    if (!allowedRoles.includes(role)) {
        return res.status(403).json({ status: 'error', message: 'Invalid role specified' });
    }

    try {
        // Fetch the current maximum user_id
        const maxIdResult = await pool.query('SELECT MAX(user_id) AS max_id FROM users');
        const nextUserId = (maxIdResult.rows[0].max_id || 0) + 1;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        const result = await pool.query(`
            INSERT INTO users (user_id, username, password, role, contact_details, phone_no, date_created)
            VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
            RETURNING *;
        `, [nextUserId, userfname, hashedPassword, role, contact_details, phone_no]);

        // Generate JWT token for the new user
        const token = jwt.sign(
            { userId: result.rows[0].user_id, username: result.rows[0].username, role: result.rows[0].role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.status(201).json({
            status: 'success',
            message: 'User account created successfully',
            data: {
                user_id: result.rows[0].user_id,
                username: result.rows[0].username,
                role: result.rows[0].role,
                contact_details: result.rows[0].contact_details,
                phone_no: result.rows[0].phone_no,
                date_created: result.rows[0].date_created,
                token
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }

});



// Create User API (Without Authentication for Testing) For Backend testing only **** DO NOT USE****, USE ABOVE
app.post('/api/users/create/test', async (req, res) => {
    const { userfname, password, role, contact_details, phone_no } = req.body;

    // Validate input
    if (!userfname || !password || !role || !contact_details || !phone_no) {
        return res.status(400).json({ status: 'error', message: 'All fields are required' });
    }

    // Validate role
    const allowedRoles = ['Admin', 'Pastor', 'Leader'];
    if (!allowedRoles.includes(role)) {
        return res.status(403).json({ status: 'error', message: 'Invalid role specified' });
    }

    try {
        // Fetch the current maximum user_id
        const maxIdResult = await pool.query('SELECT MAX(user_id) AS max_id FROM users');
        const nextUserId = (maxIdResult.rows[0].max_id || 0) + 1;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        const result = await pool.query(`
            INSERT INTO users (user_id, username, password, role, contact_details, phone_no, date_created)
            VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
            RETURNING *;
        `, [nextUserId, userfname, hashedPassword, role, contact_details, phone_no]);

        res.status(201).json({
            status: 'success',
            message: 'User account created successfully',
            data: {
                user_id: result.rows[0].user_id,
                username: result.rows[0].username,
                role: result.rows[0].role,
                contact_details: result.rows[0].contact_details,
                phone_no: result.rows[0].phone_no,
                date_created: result.rows[0].date_created
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});




app.get('/api/members/:id', async (req, res) => {
  const memberId = req.params.id;

  try {
    // Fetch member data
    const memberQuery = 'SELECT * FROM members WHERE member_id = $1';
    const memberResult = await pool.query(memberQuery, [memberId]);

    if (memberResult.rowCount === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }

    const member = memberResult.rows[0];

    // Fetch next of kin data from the next_of_kin table
    const nextOfKinQuery = 'SELECT * FROM next_of_kin WHERE member_id = $1';
    const nextOfKinResult = await pool.query(nextOfKinQuery, [memberId]);

    const nextOfKin = nextOfKinResult.rows[0] || {}; // Use the first result or an empty object if none found

    // Fetch volunteering data by joining volunteers and ministries tables
    const volunteeringQuery = `
      SELECT m.ministry_name, m.type AS ministry_type, v.role
      FROM volunteers v
      JOIN ministries m ON v.ministry_id = m.ministry_id
      WHERE v.member_id = $1
    `;
    const volunteeringResult = await pool.query(volunteeringQuery, [memberId]);

    // Initialize volunteering fields
    let fellowshipMinistryName = '';
    let fellowshipRole = '';
    let serviceMinistryName = '';
    let serviceRole = '';

    // Map the volunteering data to individual fields
    volunteeringResult.rows.forEach((volunteer) => {
      if (volunteer.ministry_type === 'Fellowship') {
        fellowshipMinistryName = volunteer.ministry_name;
        fellowshipRole = volunteer.role;
      } else if (volunteer.ministry_type === 'Service') {
        serviceMinistryName = volunteer.ministry_name;
        serviceRole = volunteer.role;
      }
    });

    // Format date_of_birth as 'YYYY-MM-DD' using date-fns
    let formattedDob = '';
    if (member.date_of_birth) {
      const dobDate = new Date(member.date_of_birth);
      if (!isNaN(dobDate)) {
        formattedDob = format(dobDate, 'yyyy-MM-dd'); // '1995-06-20'
      } else {
        console.warn(`Invalid date_of_birth format for member ID ${memberId}`);
      }
    }

    // Combine member, next of kin, and volunteering data
    const responseData = {
      ...member,
      nextOfKinFirstName: nextOfKin.first_name || '',
      nextOfKinLastName: nextOfKin.last_name || '',
      nextOfKinContactInfo: nextOfKin.contact_info || '',
      fellowshipMinistryName,
      fellowshipRole,
      serviceMinistryName,
      serviceRole,
      date_of_birth: formattedDob, // Override with formatted DOB
    };

    // Log for verification
    console.log('Formatted DOB:', formattedDob);
    console.log('Response Data:', responseData);

    res.json(responseData); // Send the combined data back to the frontend
  } catch (error) {
    console.error('Error fetching member data:', error.message);
    res.status(500).json({ error: 'Error fetching member details' });
  }
});

  


// Token Validation API
app.post('/api/validate-token', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header

    if (!token) {
        return res.status(401).json({ status: 'error', message: 'Token is missing' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Respond with the decoded token data
        res.status(200).json({
            status: 'success',
            message: 'Token is valid',
            data: {
                userId: decoded.userId,
                username: decoded.username,
                role: decoded.role,
                exp: decoded.exp
            }
        });
    } catch (err) {
        console.error('Token validation error:', err.message);

        // Handle invalid or expired tokens
        res.status(401).json({ status: 'error', message: 'Invalid or expired token' });
    }
});


// Role-Based Access Control API
app.get('/api/users/role', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token

    if (!token) {
        return res.status(401).json({ status: 'error', message: 'Token is missing' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET); // Verify and decode token

        res.status(200).json({
            status: 'success',
            data: {
                userId: decoded.userId,
                username: decoded.username,
                role: decoded.role
            }
        });
    } catch (err) {
        console.error('Role-based access control error:', err.message);
        res.status(401).json({ status: 'error', message: 'Invalid or expired token' });
    }
});


// Update User Login (Password Reset) API using Email
app.put('/api/users/update', authenticateAdmin, async (req, res) => {
    const { email, newPassword } = req.body;
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');

    // Validate input
    if (!email || !newPassword) {
        return res.status(400).json({ status: 'error', message: 'Email and new password are required' });
    }

    try {
        // Check if the user exists based on email
        const userQuery = `
            SELECT user_id, contact_details AS email, role
            FROM users
            WHERE contact_details = $1
        `;
        const userResult = await pool.query(userQuery, [email]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ status: 'error', message: 'User with the specified email not found' });
        }

        const user = userResult.rows[0];

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        const updateQuery = `
            UPDATE users
            SET password = $1, date_updated = CURRENT_TIMESTAMP
            WHERE user_id = $2
            RETURNING user_id, contact_details AS email, role;
        `;

        const updateResult = await pool.query(updateQuery, [hashedPassword, user.user_id]);

        const updatedUser = updateResult.rows[0];

        res.status(200).json({
            status: 'success',
            message: 'User password updated successfully',
            data: {
                user_id: updatedUser.user_id,
                email: updatedUser.email,
                role: updatedUser.role
            }
        });
    } catch (err) {
        console.error('Error updating user password:', err.message);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});

// Get Instructors API
app.get('/api/instructors', async (req, res) => {
    try {
        // Query to fetch users with the role 'Leader'
        const query = `
            SELECT user_id, username
            FROM users
            WHERE role = 'Leader'
            ORDER BY username;
        `;

        const result = await pool.query(query);

        res.status(200).json({
            status: 'success',
            message: 'Instructors retrieved successfully',
            data: result.rows
        });
    } catch (err) {
        console.error('Error fetching instructors:', err.message);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});

// Fellowship total member count 
app.get('/api/members-fellowship/total-count', async (req, res) => {
    const { year } = req.query; // Optional year filter

    try {
        const query = `
            SELECT
                COUNT(*)::INTEGER AS total_members, -- Total count of members
                COALESCE(json_agg(monthly_count ORDER BY monthly_count.month)::jsonb, '[]'::jsonb) AS monthly_breakdown
            FROM (
                SELECT
                    TO_CHAR(m.membership_date, 'YYYY-MM') AS month, -- Month format as YYYY-MM
                    COUNT(*)::INTEGER AS count -- Count of members per month
                FROM
                    members m
                WHERE
                    m.is_visiting = FALSE -- Exclude visiting members
                    ${year ? `AND EXTRACT(YEAR FROM m.membership_date) = ${year}` : ''} -- Optional year filter
                GROUP BY
                    TO_CHAR(m.membership_date, 'YYYY-MM')
            ) AS monthly_count;
        `;

        const result = await pool.query(query);

        res.json({
            status: 'success',
            data: {
                total_members: result.rows[0].total_members,
                monthly_breakdown: result.rows[0].monthly_breakdown,
                year: year || 'All Years', // Include year or indicate "All Years"
            },
        });
    } catch (err) {
        console.error('Error fetching member count:', err.message);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});

// Felowship-minstries member count per ministry
app.get('/api/fellowship-ministries', async (req, res) => {
    const { year } = req.query; //  the year query parameters

    try {
        const query = `
            SELECT
                min.ministry_id,
                min.ministry_name,
                min.leader_name AS instructor,
                COUNT(
                    CASE 
                        WHEN m.is_visiting = FALSE 
                             AND DATE_PART('year', AGE(m.date_of_birth)) >= 18 
                             ${year ? `AND EXTRACT(YEAR FROM mm.assigned_at) = ${year}` : ''}
                        THEN m.member_id
                    END
                )::INTEGER AS total_members
            FROM
                ministries min
            LEFT JOIN member_ministries mm ON min.ministry_id = mm.ministry_id
            LEFT JOIN members m ON mm.member_id = m.member_id
            WHERE
                min.type = 'Fellowship' -- Only fellowship ministries
            GROUP BY
                min.ministry_id, min.ministry_name, min.leader_name
            ORDER BY
                min.ministry_id;
        `;

        const result = await pool.query(query);
        res.json({
            status: 'success',
            data: result.rows,
            year: year || 'All Years', // Include year in the response
        });
    } catch (err) {
        console.error('Error fetching fellowship ministries:', err.message);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});

// Felloswship age-dritribution 
app.get('/api/fellowship-ministries/age-distribution', async (req, res) => {
    const { year } = req.query; //  the year  query parameters

    try {
        const query = `
            SELECT
                min.ministry_name,
                CASE
                    WHEN DATE_PART('year', AGE(m.date_of_birth)) BETWEEN 18 AND 25 THEN '18-25'
                    WHEN DATE_PART('year', AGE(m.date_of_birth)) BETWEEN 26 AND 35 THEN '26-35'
                    WHEN DATE_PART('year', AGE(m.date_of_birth)) BETWEEN 36 AND 49 THEN '36-49'
                    WHEN DATE_PART('year', AGE(m.date_of_birth)) BETWEEN 50 AND 64 THEN '50-64'
                    WHEN DATE_PART('year', AGE(m.date_of_birth)) >= 65 THEN '65+'
                END AS age_range,
                COUNT(m.member_id)::INTEGER AS total
            FROM
                members m
            JOIN member_ministries mm ON m.member_id = mm.member_id
            JOIN ministries min ON mm.ministry_id = min.ministry_id
            WHERE
                min.type = 'Fellowship' -- Only fellowship ministries
                AND m.is_visiting = FALSE -- Exclude visiting members
                AND DATE_PART('year', AGE(m.date_of_birth)) >= 18 -- Include only members aged 18+
                ${year ? `AND EXTRACT(YEAR FROM mm.assigned_at) = ${year}` : ''} -- Optional year filter
            GROUP BY
                min.ministry_name, age_range
            ORDER BY
                min.ministry_name, age_range;
        `;

        const result = await pool.query(query);
        res.json({
            status: 'success',
            data: result.rows,
            year: year || 'All Years', // Include year in the response
        });
    } catch (err) {
        console.error('Error fetching age distribution:', err.message);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});

// Fellowship ministries work status 
app.get('/api/fellowship-ministries/work-status', async (req, res) => {
    const { year } = req.query; // the year query parameters

    try {
        const query = `
            SELECT
                min.ministry_name,
                m.occupation_status,
                COUNT(CASE WHEN m.gender = 'Male' THEN 1 END)::INTEGER AS male_count,
                COUNT(CASE WHEN m.gender = 'Female' THEN 1 END)::INTEGER AS female_count,
                (COUNT(CASE WHEN m.gender = 'Male' THEN 1 END) + COUNT(CASE WHEN m.gender = 'Female' THEN 1 END))::INTEGER AS total_count
            FROM
                members m
            JOIN member_ministries mm ON m.member_id = mm.member_id
            JOIN ministries min ON mm.ministry_id = min.ministry_id
            WHERE
                min.type = 'Fellowship' -- Only fellowship ministries
                AND m.is_visiting = FALSE -- Exclude visiting members
                AND DATE_PART('year', AGE(m.date_of_birth)) >= 18 -- Include only members aged 18+
                ${year ? `AND EXTRACT(YEAR FROM mm.assigned_at) = ${year}` : ''} -- Optional year filter
            GROUP BY
                min.ministry_name, m.occupation_status
            ORDER BY
                total_count DESC; -- Use total_count for ordering
        `;

        const result = await pool.query(query);
        res.json({
            status: 'success',
            data: result.rows,
            year: year || 'All Years', // Include year in the response
        });
    } catch (err) {
        console.error('Error fetching work status:', err.message);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});







app.put('/api/members/:id', async (req, res) => {
    const memberId = parseInt(req.params.id, 10);
    const {
        sir_name,
        middle_name,
        last_name,
        date_of_birth,
        contact_info,
        gender,
        location,
        county_of_origin,
        occupation_status,
        married_status,
        is_visiting,
        fellowship_ministries,
        service_ministries,
        is_full_member,
        baptized,
        conversion_date,
        discipleship_class_id,
        completed_class,
        next_of_kin,
        volunteering,
    } = req.body;

    try {
        // Step 1: Check if the member exists
        const memberCheck = await pool.query('SELECT * FROM members WHERE member_id = $1', [memberId]);
        if (memberCheck.rowCount === 0) {
            return res.status(404).json({ error: 'Member not found' });
        }

        // Step 2: Update the members table
        const updateMemberQuery = `
            UPDATE members
            SET 
                name = $1,
                contact_info = $2,
                date_of_birth = $3,
                married_status = $4,
                occupation_status = $5,
                fellowship_ministries = $6,
                service_ministries = $7,
                baptized = $8,
                conversion_date = $9,
                is_full_member = $10,
                is_visiting = $11,
                location = $12,
                county_of_origin = $13,
                gender = $14,
                discipleship_class_id = $15,
                completed_class = $16,
                membership_date = NOW()
            WHERE member_id = $17
            RETURNING *;
        `;

        const updateMemberValues = [
            `${sir_name} ${middle_name} ${last_name}`.trim(),
            contact_info,
            date_of_birth,
            married_status,
            occupation_status,
            fellowship_ministries,
            service_ministries,
            !!baptized, // Convert to boolean
            conversion_date,
            !!is_full_member, // Convert to boolean
            !!is_visiting, // Convert to boolean
            location,
            county_of_origin,
            gender,
            discipleship_class_id,
            completed_class === true, // Ensure boolean value
            memberId,
        ];

        const updatedMemberResult = await pool.query(updateMemberQuery, updateMemberValues);
        const updatedMember = updatedMemberResult.rows[0];

        // Step 3: Update the next_of_kin table (if provided)
        if (next_of_kin && next_of_kin.first_name && next_of_kin.last_name && next_of_kin.contact_info) {
            // Check if next_of_kin exists for this member
            const nextOfKinCheck = await pool.query('SELECT * FROM next_of_kin WHERE member_id = $1', [memberId]);

            if (nextOfKinCheck.rowCount > 0) {
                // Update existing next_of_kin
                const updateNextOfKinQuery = `
                    UPDATE next_of_kin
                    SET 
                        first_name = $1,
                        last_name = $2,
                        contact_info = $3
                    WHERE member_id = $4
                    RETURNING *;
                `;
                const updateNextOfKinValues = [
                    next_of_kin.first_name,
                    next_of_kin.last_name,
                    next_of_kin.contact_info,
                    memberId,
                ];

                await pool.query(updateNextOfKinQuery, updateNextOfKinValues);
            } else {
                // Insert new next_of_kin
                const insertNextOfKinQuery = `
                    INSERT INTO next_of_kin (member_id, first_name, last_name, contact_info)
                    VALUES ($1, $2, $3, $4);
                `;
                const insertNextOfKinValues = [
                    memberId,
                    next_of_kin.first_name,
                    next_of_kin.last_name,
                    next_of_kin.contact_info,
                ];

                await pool.query(insertNextOfKinQuery, insertNextOfKinValues);
            }
        }

        // Step 4: Update the volunteers table (if provided)
        if (volunteering && volunteering.role) {
            // Check if volunteering record exists for this member
            const volunteerCheck = await pool.query('SELECT * FROM volunteers WHERE member_id = $1', [memberId]);

            if (volunteerCheck.rowCount > 0) {
                // Update existing volunteer
                const updateVolunteerQuery = `
                    UPDATE volunteers
                    SET role = $1
                    WHERE member_id = $2
                    RETURNING *;
                `;
                const updateVolunteerValues = [
                    volunteering.role,
                    memberId,
                ];

                await pool.query(updateVolunteerQuery, updateVolunteerValues);
            } else {
                // Insert new volunteer
                const nextVolunteerIdResult = await pool.query('SELECT COALESCE(MAX(volunteer_id), 0) + 1 AS next_id FROM volunteers');
                const nextVolunteerId = nextVolunteerIdResult.rows[0].next_id;

                const insertVolunteerQuery = `
                    INSERT INTO volunteers (volunteer_id, member_id, role)
                    VALUES ($1, $2, $3);
                `;
                const insertVolunteerValues = [
                    nextVolunteerId,
                    memberId,
                    volunteering.role,
                ];

                await pool.query(insertVolunteerQuery, insertVolunteerValues);
            }
        }
            // Respond with the updated member details
            res.status(200).json({
                message: 'Member updated successfully',
                member: updatedMember,
            });
    
        } catch (error) {
            console.error('Error updating member:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
});  



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
