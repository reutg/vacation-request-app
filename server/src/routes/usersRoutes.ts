import { Router } from "express";
import appDataSource from "../db/dataSource.js";
import type { UserRole } from "../entities/User.js";
import { User } from "../entities/User.js";

const router = Router();
const validRoles: UserRole[] = ["Requester", "Validator"];

router.get("/", async (_req, res, next) => {
  try {
    const users = await appDataSource.getRepository(User).find({
      select: { id: true, name: true, role: true },
      order: { id: "ASC" },
    });

    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
    const role = req.body?.role as UserRole;

    if (!name) {
      return res.status(400).json({ message: "name is required" });
    }

    if (!validRoles.includes(role)) {
      return res
        .status(400)
        .json({ message: "role must be Requester or Validator" });
    }

    const userRepository = appDataSource.getRepository(User);
    const user = userRepository.create({ name, role });
    const createdUser = await userRepository.save(user);

    res.status(201).json(createdUser);
  } catch (error) {
    next(error);
  }
});

export { router as usersRoutes };
