const express = require('express');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const cors = require('cors')


// Load environment variables
dotenv.config();

// Initialize Express
const app = express();



app.use(cors({
    origin: ['http://localhost:5173', 'https://statistics-production-032c.up.railway.app'], 
    methods: 'GET,POST', 
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

// Sample route
app.get('/', (req, res) => {
  res.send('API is working!');
});
// Adding memeber 
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
        // Step 1: Get the next member_id
        const nextMemberIdResult = await pool.query('SELECT COALESCE(MAX(member_id), 0) + 1 AS next_id FROM members');
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
        ];

        const memberResult = await pool.query(memberQuery, memberValues);
        const memberId = memberResult.rows[0].member_id;

        // Step 3: Insert next of kin into the next_of_kin table
        if (next_of_kin && next_of_kin.first_name && next_of_kin.last_name && next_of_kin.contact_info) {
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

        // Step 4: Insert volunteering data into the volunteers table
        if (volunteering && volunteering.role) {
            // Get the next volunteer_id
            const nextVolunteerIdResult = await pool.query('SELECT COALESCE(MAX(volunteer_id), 0) + 1 AS next_id FROM volunteers');
            const nextVolunteerId = nextVolunteerIdResult.rows[0].next_id;

            const volunteeringQuery = `
                INSERT INTO volunteers (volunteer_id, member_id, role)
                VALUES ($1, $2, $3);
            `;

            const volunteeringValues = [nextVolunteerId, memberId, volunteering.role];
            await pool.query(volunteeringQuery, volunteeringValues);
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

// Get all members
app.get('/api/members', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM members');
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching members' });
    }
  });

//Get all members count & allow yearmonth filter
app.get('/api/members/count', async (req, res) => {
    const { year, month } = req.query;
    try {
        let query = 'SELECT COUNT(*)::INTEGER AS total_members FROM members';
        let conditions = [];
        
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
        let query = "SELECT COUNT(*)::INTEGER AS total_conversions FROM members WHERE conversion_date IS NOT NULL";
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
app.get('/api/ministries/count', async (req, res) => {
    try {
        const result = await pool.query('SELECT COUNT(*)::INTEGER AS total_ministries FROM ministries');
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
                    WHEN DATE_PART('year', AGE(date_of_birth)) = 0 AND DATE_PART('month', AGE(date_of_birth)) BETWEEN 1 AND 11 THEN '1-11 M'
                    WHEN DATE_PART('year', AGE(date_of_birth)) BETWEEN 1 AND 5 THEN '1-5' 
                    WHEN DATE_PART('year', AGE(date_of_birth)) BETWEEN 6 AND 10 THEN '6-10'
                    WHEN DATE_PART('year', AGE(date_of_birth)) BETWEEN 11 AND 17 THEN '11-17'
                    WHEN DATE_PART('year', AGE(date_of_birth)) BETWEEN 18 AND 25 THEN '18-25'
                    WHEN DATE_PART('year', AGE(date_of_birth)) BETWEEN 26 AND 35 THEN '26-35'
                    WHEN DATE_PART('year', AGE(date_of_birth)) BETWEEN 36 AND 49 THEN '36-49'
                    WHEN DATE_PART('year', AGE(date_of_birth)) >= 50 THEN '50+'
                    ELSE 'Unknown'
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


app.get('/api/members/work-status', async (req, res) => {
    try {
        const query = `
            SELECT occupation_status, COUNT(*)::INTEGER AS count
            FROM members
            GROUP BY occupation_status
            ORDER BY count ASC
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

app.get('/api/members/gender-distribution', async (req, res) => {
    try {
        const query = `
            SELECT gender, COUNT(*) ::INTEGER AS count
            FROM members
            GROUP BY gender
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});


app.get('/api/members/marital-status', async (req, res) => {
    try {
        const query = `
            SELECT 
                married_status,
                COUNT(*)::INTEGER AS count
            FROM members
            GROUP BY married_status
            ORDER BY count ASC
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});


app.get('/api/members/residence', async (req, res) => {
    try {
        const query = `
            SELECT location AS residence, COUNT(*) ::INTEGER AS count
            FROM members
            GROUP BY location
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

app.get('/api/members/county-origin', async (req, res) => {
    try {
        const query = `
            SELECT county_of_origin, COUNT(*)::INTEGER AS count
            FROM members
            GROUP BY county_of_origin
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});


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
    try {
        const query = `
            SELECT location AS residence, COUNT(*) ::INTEGER AS count
            FROM members
            GROUP BY location
            LIMIT 6
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});



// members who are just visting 
app.get('/api/just-visiting', async (req, res) => {
    const { startDate, endDate } = req.query;
  
    try {
      const result = await pool.query(`
        SELECT
          COUNT(*)::INTEGER AS total_visitors
        FROM
          members m
        WHERE
          m.is_visiting = TRUE
          AND ($1::DATE IS NULL OR m.membership_date >= $1)
          AND ($2::DATE IS NULL OR m.membership_date <= $2);
      `, [startDate || null, endDate || null]);
  
      res.json({ status: 'success', data: { total_visitors: result.rows[0].total_visitors } });
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  });

// retentation rate by month 
  app.get('/api/retention-rate', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                TO_CHAR(dc.start_date, 'YYYY-MM-DD') AS start_date, -- Use full date
                COUNT(DISTINCT m.member_id)::INTEGER  AS total_members,
                COUNT(DISTINCT CASE WHEN m.completed_class = TRUE THEN m.member_id END)::INTEGER  AS completed_members,
                COUNT(DISTINCT CASE WHEN m.completed_class = FALSE THEN m.member_id END)::INTEGER  AS dropped_out_members,
                COUNT(DISTINCT CASE WHEN m.completed_class = TRUE AND m.gender = 'Male' THEN m.member_id END)::INTEGER AS male_completed,
                COUNT(DISTINCT CASE WHEN m.completed_class = TRUE AND m.gender = 'Female' THEN m.member_id END)::INTEGER AS female_completed,
                ROUND(
                    COUNT(DISTINCT CASE WHEN m.completed_class = TRUE THEN m.member_id END)::decimal /
                    NULLIF(COUNT(DISTINCT m.member_id), 0) * 100, 2
                ) AS retention_rate
            FROM
                discipleship_classes dc
            LEFT JOIN members m ON m.discipleship_class_id = dc.class_id
            GROUP BY
                TO_CHAR(dc.start_date, 'YYYY-MM-DD') -- Group by full date
            ORDER BY
                start_date; -- Order by the full date
        `);
    
        res.json({ status: 'success', data: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});

 // overall-retention rate  
app.get('/api/overall-retention-rate', async (req, res) => {
    try {
        const result = await pool.query(`
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
                m.discipleship_class_id IS NOT NULL;
        `);
    
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
 
// getting all discilpeship classes 
app.get('/api/discipleship-classes', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                dc.class_id,
                dc.class_name,
                dc.instructor
            FROM
                discipleship_classes dc
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
app.post('/api/discipleship-classes_add', async (req, res) => {
    const { class_name, instructor, creation_date, end_date, description, type } = req.body;

    // Validate request body
    if (!class_name || !instructor || !creation_date || !end_date || !type) {
        return res.status(400).json({ status: 'error', message: 'Missing required fields' });
    }

    // Validate 'type' value
    if (!['Virtual', 'Physical'].includes(type)) {
        return res.status(400).json({ status: 'error', message: "Type must be either 'Virtual' or 'Physical'" });
    }

    try {
        // Get the current maximum class_id
        const maxIdResult = await pool.query(`SELECT MAX(class_id) AS max_id FROM discipleship_classes;`);
        const nextClassId = (maxIdResult.rows[0].max_id || 0) + 1; // Default to 1 if table is empty

        // Insert the new class
        const result = await pool.query(
            `INSERT INTO discipleship_classes (class_id, class_name, instructor, start_date, end_date, description, type)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *;`,
            [nextClassId, class_name, instructor, creation_date, end_date, description || null, type]
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

// discipleship class Monthly Completion Stats or use the retention api 
app.get('/api/monthly-completed-stats', async (req, res) => {
    const { year } = req.query; // Get year from query parameter

    // Use the current year if no year is specified
    const currentYear = new Date().getFullYear();
    const targetYear = year ? parseInt(year, 10) : currentYear;

    try {
        const result = await pool.query(`
            SELECT
                TO_CHAR(m.membership_date, 'YYYY-MM') AS month,
                COUNT(CASE WHEN m.completed_class = TRUE AND m.gender = 'Male' THEN 1 END)::INTEGER AS male_completed_count,
                COUNT(CASE WHEN m.completed_class = TRUE AND m.gender = 'Female' THEN 1 END)::INTEGER AS female_completed_count
            FROM
                members m
            WHERE
                m.discipleship_class_id IS NOT NULL
                AND EXTRACT(YEAR FROM m.membership_date) = $1
            GROUP BY
                TO_CHAR(m.membership_date, 'YYYY-MM')
            ORDER BY
                month;
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


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
