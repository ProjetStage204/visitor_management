import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logoH from "../photos/logoH.png";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const [visitors, setVisitors] = useState([]);
  const [stats, setStats] = useState({});
  const [search, setSearch] = useState("");
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios.get("http://127.0.0.1:8000/api/auth/user", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => setUserRole(response.data.user.role))
    .catch((error) => console.error("Erreur chargement du rôle utilisateur", error));

    axios.get("http://127.0.0.1:8000/api/visitor-stats", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => setStats(response.data))
    .catch((error) => console.error("Erreur chargement des stats", error));

    axios.get("http://127.0.0.1:8000/api/visitors", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => setVisitors(response.data))
    .catch((error) => console.error("Erreur chargement des visiteurs", error));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
  
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce visiteur ?")) {
      return;
    }
  
    try {
      await axios.delete(`http://127.0.0.1:8000/api/visitors/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      // ✅ Met à jour la liste des visiteurs après suppression
      setVisitors(visitors.filter(visitor => visitor.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression", error);
    }
  };
  

  const filteredVisitors = visitors.filter(visitor =>
    visitor.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
        {/* Header */}
        <header className="bg-white text-blue-950 py-6 px-6 flex items-center justify-center shadow-lg relative h-24">
        <img src={logoH} alt="Logo Ministère" className="absolute left-6 h-full w-auto" />
        <h1 className="text-5xl font-bold font-serif tracking-wide">Ministère de la Justice</h1>

        {/* ✅ Bouton Déconnexion */}
        <button 
          onClick={handleLogout}
          className="absolute right-6 bg-red-600 text-white px-5 py-2 rounded-lg shadow hover:bg-red-500 transition"
        >
          Déconnexion
        </button>
      </header>
      <div className="p-6">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">Tableau de Bord - Ministère de la Justice</h1>

      <button
        onClick={() => navigate("/add-visitor")}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 transition"
      >
        Ajouter un Visiteur
      </button>

      <input
        type="text"
        placeholder="Rechercher un visiteur..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
      />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-xl font-semibold">Total Visiteurs</h2>
          <p className="text-2xl">{stats.total_visitors || 0}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-xl font-semibold">Visites Aujourd'hui</h2>
          <p className="text-2xl">{stats.visits_today || 0}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-xl font-semibold">Visites ce Mois</h2>
          <p className="text-2xl">{stats.visits_this_month || 0}</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={stats.visits_per_month || []}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="visits" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>

      <div className="bg-white p-6 shadow rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Liste des Visiteurs</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Nom</th>
              <th className="border p-2">CIN</th>
              <th className="border p-2">Téléphone</th>
              <th className="border p-2">Raison</th>
              {userRole === "admin" && <th className="border p-2">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredVisitors.length > 0 ? (
              filteredVisitors.map((visitor) => (
                <tr key={visitor.id} className="text-center">
                  <td className="border p-2">{visitor.name}</td>
                  <td className="border p-2">{visitor.cin}</td>
                  <td className="border p-2">{visitor.phone}</td>
                  <td className="border p-2">{visitor.reason}</td>
                  {userRole === "admin" && (
                    <td className="border p-2 flex justify-center space-x-2">
                      <button onClick={() => navigate(`/edit-visitor/${visitor.id}`)} className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-400 transition">Modifier</button>
                      <button onClick={() => handleDelete(visitor.id)} className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-500 transition">Supprimer</button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={userRole === "admin" ? "5" : "4"} className="border p-2 text-center text-gray-500">Aucun visiteur trouvé</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};

export default Dashboard;
