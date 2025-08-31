import dotenv from "dotenv";
import connectDB from "../db.js";
import Profile from "../models/Profile.js";
import Project from "../models/Project.js";
dotenv.config();
await connectDB();
const profileData = {
  name: "SAMANVAY BHARTIYA",
  email: "samanvaybhartiya@gmail.com",
  summary:
    "MERN-stack developer building secure, performant apps with Stripe, JWT auth, real-time Socket.IO; strong in React 19, Node.js, and MongoDB.",
  links: {
    github: "https://github.com/samanvaybhartiya",
    linkedin: "https://www.linkedin.com/in/samanvay-bhartiya-0b2b5425a/",
    portfolio: "",
    other: [
      { 
        label: "Resume", url: "https://drive.google.com/file/d/1gikfrtSiqEBoxq-JSSXTyztDpuJ8R8c1/view?usp=sharing",
        label: "Phone", url: "tel:+916386863928"
       }
    ]
  },
  education: [
    {
      school: "IIIT Nagpur",
      degree: "B.Tech in Electronics and Communication Engineering",
      start: "2022-11",
      end: "2026-06"
    },
    { school: "Sangam International School, Pratapgarh (U.P.)", degree: "Class 10th – 94%", start: "", end: "" },
    { school: "Sangam International School, Pratapgarh (U.P.)", degree: "Class 12th – 83%", start: "", end: "" }
  ],
  work: [
    {
      company: "IIIT Nagpur",
      role: "Student Training & Placement Cell Representative",
      start: "2024",
      end: "Present",
      description: "Represented students for T&P; coordination and placement communication."
    },
    {
      company: "TantraFiesta (Tech Fest)",
      role: "Content Team Member",
      start: "2025",
      end: "2025",
      description: "Directed event content & promotional strategy."
    }
  ],
  
  skills: [
    "C++","C","Java","JavaScript","Python","PHP",
    "React","HTML","CSS","Tailwind","Vite",
    "Node.js","ExpressJS","Appwrite",
    "MongoDB","MySQL","PostgreSQL",
    "Redux","Stripe","Socket.IO","JWT","MVC","REST APIs",
    "Git","GitHub","Postman","CI/CD"
  ]
};
const projectsData = [
  {
    title: "GreenCart – Grocery E-commerce Platform",
    description:
      "MERN grocery platform with JWT-secured login, role-based dashboards, Stripe integration, and admin CRUD for 200+ products.",
    skills: ["MongoDB","ExpressJS","ReactJS","NodeJS","Stripe","Redux","Tailwind CSS","Lazy Loading","Code Splitting","JWT","RBAC"],
    links: [
      { label: "GitHub", url: "https://github.com/samanvaybhartiya/green-cart" },
      { label: "Live", url: "https://green-cart-gh3d.vercel.app/" }
    ]
  },
  {
    title: "Travel Agency Website – Modern Responsive Web App",
    description:
      "React 19 + Vite app with Appwrite auth/permissions, Stripe test mode, Gemini AI for itineraries, and Syncfusion analytics.",
    skills: ["React 19","Vite","Tailwind CSS","Appwrite","Stripe","Gemini AI","Syncfusion","Unsplash API"],
    links: [
      { label: "GitHub", url: "https://github.com/samanvaybhartiya/travel-agency-website" }
    ]
  },
  {
    title: "Real-time Chat App – Socket.IO Communication",
    description:
      "Public/private/group chats for 50+ concurrent users, sub-300ms latency, JWT sessions, and 10k+ test messages stored.",
    skills: ["ReactJS","Node.js","Express","MongoDB","Socket.IO","JWT"],
    links: [
      { label: "GitHub", url: "https://github.com/samanvaybhartiya/chat_app" }
    ]
  }
];
async function run() {
  await Profile.deleteMany({});
  await Project.deleteMany({});
  await Profile.create(profileData);
  await Project.insertMany(projectsData);
  console.log("✅ Seeded profile & projects");
  process.exit(0);
}
run().catch((e) => {
  console.error(e);
  process.exit(1);
});
