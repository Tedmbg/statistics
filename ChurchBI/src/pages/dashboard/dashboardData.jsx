import { useState, useEffect } from "react";

export const useDashboardData = () => {
  const [data, setData] = useState({
    members: null,
    conversions: null,
    ministries: null,
    baptisms: null,
    discipleshipClasses: null,
    staff: null,
  });

  const fetchData = async () => {
    try {
      const [membersRes, conversionsRes, ministriesRes, baptismsRes, discipleshipRes, staffRes] = await Promise.all([
        fetch('/api/members/count').then((res) => res.json()),
        fetch('/api/conversions/count').then((res) => res.json()),
        fetch('/api/ministries/count').then((res) => res.json()),
        fetch('/api/baptisms/count').then((res) => res.json()),
        fetch('/api/discipleship_classes/completed/count').then((res) => res.json()),
        fetch('/api/staff/count').then((res) => res.json()),
      ]);

      setData({
        members: membersRes,
        conversions: conversionsRes,
        ministries: ministriesRes,
        baptisms: baptismsRes,
        discipleshipClasses: discipleshipRes,
        staff: staffRes,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return data;
};
