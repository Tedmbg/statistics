// src/utils/fetchDashboardData.js
export const fetchDemographicData = async () => {
  try {
    const [
      ageDistributionRes,
      workStatusRes,
      residenceDistributionRes,
      membershipOverTimeRes,
      genderDistributionRes,
      maritalStatusRes,
      countryOfOriginRes
    ] = await Promise.all([
      fetch("https://statistics-production-032c.up.railway.app/api/members/age-distribution").then((res) => res.json()),
      fetch("https://statistics-production-032c.up.railway.app/api/members/work-status").then((res) => res.json()),
      fetch("https://statistics-production-032c.up.railway.app/api/members/residence3").then((res) => res.json()),
      fetch("https://statistics-production-032c.up.railway.app/api/members/monthly").then((res) => res.json()),
      fetch("https://statistics-production-032c.up.railway.app/api/members/gender-distribution").then((res) => res.json()),
      fetch("https://statistics-production-032c.up.railway.app/api/members/marital-status").then((res) => res.json()),
      fetch("https://statistics-production-032c.up.railway.app/api/members/county-origin").then((res) => res.json())

    ]);

    return {
      ageDistribution: {
        labels: ageDistributionRes.map((item)=>item.age_range),
        datasets: [
          {
            data: ageDistributionRes.map((item)=>item.count),
            backgroundColor: ["#f8766d", "#7bbf5e", "#f0a500", "#b4b7c6"]
          }
        ]
      },
      workStatus: {
        labels: workStatusRes.map((item)=>item.occupation_status),
        datasets: [
          {
            data: workStatusRes.map((item)=>item.count),
            backgroundColor: ["#6c8ef2", "#8d78eb"]
          }
        ]
      },
      locationDistribution: {
        labels: residenceDistributionRes.map((item)=>item.residence),
        datasets:[
          {
            data: residenceDistributionRes.map((item)=>item.count),
            backgroundColor:"#f49d5c"
          }]
        
      },
      membershipOverTime: {
        labels: membershipOverTimeRes.map((item)=>item.month),
        datasets: [
          {
            data: membershipOverTimeRes.map((item)=>item.count),
            fill: false,
            borderColor: "#8c96c6",
            radius: 3,
            backgroundColor: "#5687F2"
          }
        ]
      },
      genderDistribution: {
        labels: genderDistributionRes.map((item)=>item.gender),
        datasets: [
          {
            data: genderDistributionRes.map((item)=>item.count),
            backgroundColor: ["#4a90e2", "#f55a4e"]
          }
        ]
      },
      marriage: {
        labels: maritalStatusRes.map((item)=>item.married_status),
        datasets: [
          {
            data: maritalStatusRes.map((item)=>item.count),
            backgroundColor: ["#4a90e2", "#f55a4e","#f55a4e","#f55a4e"]
          }
        ]
      },
      countryOfOrigin: {
        labels: countryOfOriginRes.map((item)=>item.county_of_origin),
        datasets: [
          {
            data: countryOfOriginRes.map((item)=>item.count),
            backgroundColor:"#4A9ECB"
          }
        ]
      }
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    
  }
};
