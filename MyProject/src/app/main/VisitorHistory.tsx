import React,{ useEffect, useState } from "react";
import axios from "axios";
import { View, Text, ActivityIndicator, FlatList } from "react-native";
import { API_URL } from "@env";
interface Visitor {
  id: number;
  name: string;
  company?: string;
  type: "Guest" | "Delivery";
  date: string; // Static date-time from API
  status: "allowed" | "denied";
}

const VisitorHistory = () => {
  const [history, setHistory] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      const [guestsResponse, deliveriesResponse] = await Promise.all([
        axios.get(`${API_URL}/api/v1/guests`),
        axios.get(`${API_URL}/api/v1/deliveries`),
      ]);

      console.log("Guests API Response:", guestsResponse.data);
      console.log("Deliveries API Response:", deliveriesResponse.data);

      const guests = guestsResponse.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        type: "Guest",
        date: item.created_at || item.date, // ✅ Using static timestamp from backend
        status: item.status || "unknown",
      }));

      const Deliveries = deliveriesResponse.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        company: item.company || "N/A",
        type: "Delivery",
        date: item.created_at || item.date, // ✅ Using static timestamp from backend
        status: item.status || "unknown",
      }));

      // ✅ Sort by date (newest first)
      const sortedHistory = [...guests, ...Deliveries].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setHistory(sortedHistory);
    } catch (err) {
      console.error("API Fetch Error:", err);
      setError("Failed to fetch visitor history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();

    // ✅ Auto-refresh every 10 seconds
    const interval = setInterval(fetchHistory, 10000);

    return () => clearInterval(interval);
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#007bff" />;
  if (error) return <Text style={{ color: "red", padding: 10 }}>{error}</Text>;

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        Visitor History
      </Text>

      <FlatList
        data={history}
        keyExtractor={(item) => `${item.type}-${item.id}`}

        renderItem={({ item }) => (
          <View
            style={{
              padding: 10,
              borderBottomWidth: 1,
              borderBottomColor: "#ccc",
            }}
          >
            <Text>Name: {item.name}</Text>
            <Text>Type: {item.type}</Text>
            {item.type === "Delivery" && <Text>Company: {item.company}</Text>}
            <Text>
              Date: {new Date(item.date).toLocaleDateString()} -{" "}
              {new Date(item.date).toLocaleTimeString()} {/* ✅ Static time */}
            </Text>
            <Text>Status: {item.status}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default VisitorHistory;