// src/routes/api.js
import { Router } from "express";
import Profile from "../models/Profile.js";
import Project from "../models/Project.js";
import { requireAdminKey } from "../middleware/adminKey.js";

const router = Router();

// Simple health for the router (mounted under /api)
router.get("/health", (req, res) => res.json({ status: "ok" }));

// ------- PROFILE -------
router.get("/profile", async (req, res, next) => {
  try {
    const d = await Profile.findOne();
    res.json(d || {});
  } catch (e) {
    next(e);
  }
});

router.post("/profile", requireAdminKey, async (req, res, next) => {
  try {
    const ex = await Profile.findOne();
    if (ex) return res.status(409).json({ error: "Profile exists. Use PUT." });
    const c = await Profile.create(req.body);
    res.status(201).json(c);
  } catch (e) {
    next(e);
  }
});

router.put("/profile", requireAdminKey, async (req, res, next) => {
  try {
    const u = await Profile.findOneAndUpdate({}, req.body, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });
    res.json(u);
  } catch (e) {
    next(e);
  }
});

// ------- PROJECTS -------
router.get("/projects", async (req, res, next) => {
  try {
    const { skill, limit = 20, page = 1 } = req.query;
    const q = {};

    if (skill) {
      // Fuzzy/forgiving match: "node js" matches "Node.js"/"NodeJS", "socket" matches "Socket.IO"
      const raw = String(skill).trim();
      const escaped = raw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // escape regex meta
      const normalized = escaped.replace(/\s+/g, "[\\s._-]*"); // spaces -> optional punctuation/space
      q.skills = { $regex: new RegExp(normalized, "i") };
    }

    const docs = await Project.find(q)
      .sort({ createdAt: -1 })
      .skip((+page - 1) * (+limit))
      .limit(+limit);

    res.json(docs);
  } catch (e) {
    next(e);
  }
});

router.post("/projects", requireAdminKey, async (req, res, next) => {
  try {
    const c = await Project.create(req.body);
    res.status(201).json(c);
  } catch (e) {
    next(e);
  }
});

// ------- SKILLS TOP -------
router.get("/skills/top", async (req, res, next) => {
  try {
    const agg = await Project.aggregate([
      { $unwind: "$skills" },
      { $group: { _id: { $toLower: "$skills" }, count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } },
    ]);

    const prof = await Profile.findOne();
    const map = new Map(agg.map((s) => [s._id, s.count]));
    if (prof?.skills?.length) {
      for (const s of prof.skills) {
        const k = String(s).toLowerCase();
        map.set(k, (map.get(k) || 0) + 1);
      }
    }

    const result = [...map.entries()]
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count);

    res.json(result);
  } catch (e) {
    next(e);
  }
});

// ------- SEARCH -------
router.get("/search", async (req, res, next) => {
  try {
    const q = String(req.query.q || "").trim();
    if (!q) return res.json({ projects: [], profile: null });

    const projects = await Project.find({ $text: { $search: q } }).limit(25);

    const profile = await Profile.findOne({
      $or: [
        { name: new RegExp(q, "i") },
        { summary: new RegExp(q, "i") },
        { "work.company": new RegExp(q, "i") },
        { "work.role": new RegExp(q, "i") },
        { skills: new RegExp(q, "i") },
      ],
    });

    res.json({ projects, profile });
  } catch (e) {
    next(e);
  }
});

export default router;
