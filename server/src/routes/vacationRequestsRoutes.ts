import { Router } from "express";
import appDataSource from "../db/dataSource.js";
import {
  VacationRequest,
  type VacationRequestStatus,
} from "../entities/VacationRequest.js";
import { User } from "../entities/User.js";

const VACATION_REQUEST_STATUSES: VacationRequestStatus[] = [
  "Pending",
  "Approved",
  "Rejected",
];

function serializeVacationRequest(entity: VacationRequest) {
  return {
    id: entity.id,
    userId: entity.userId,
    startDate: entity.startDate,
    endDate: entity.endDate,
    reason: entity.reason,
    status: entity.status,
    comments: entity.comments,
    createdAt:
      entity.createdAt instanceof Date
        ? entity.createdAt.toISOString()
        : String(entity.createdAt),
  };
}

const router = Router();

const getStringQueryParam = (value: unknown): string => {
  if (typeof value === "string") {
    return value.trim();
  }

  if (Array.isArray(value) && typeof value[0] === "string") {
    return value[0].trim();
  }

  return "";
};

const parseVacationRequestStatus = (
  value: unknown,
): VacationRequestStatus | undefined => {
  const status = getStringQueryParam(value);

  if (!status) {
    return undefined;
  }

  if (!VACATION_REQUEST_STATUSES.includes(status as VacationRequestStatus)) {
    throw new Error("status must be one of: Pending, Approved, Rejected");
  }

  return status as VacationRequestStatus;
};

router.get("/", async (req, res, next) => {
  try {
    const status = parseVacationRequestStatus(req.query.status);

    const vacationRequestRepository =
      appDataSource.getRepository(VacationRequest);

    const requests = await vacationRequestRepository.find({
      where: status ? { status } : {},
      order: { startDate: "ASC", id: "ASC" },
    });

    res.json(requests.map(serializeVacationRequest));
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }

    next(error);
  }
});

router.get("/stats", async (_req, res, next) => {
  try {
    const repo = appDataSource.getRepository(VacationRequest);
    const rows = await repo
      .createQueryBuilder("vr")
      .select("vr.status", "status")
      .addSelect("COUNT(*)", "count")
      .groupBy("vr.status")
      .getRawMany<{ status: VacationRequestStatus; count: string }>();

    const byStatus: Record<VacationRequestStatus, number> = {
      Pending: 0,
      Approved: 0,
      Rejected: 0,
    };
    for (const row of rows) {
      if (row.status in byStatus) {
        byStatus[row.status] = Number(row.count);
      }
    }

    const total = byStatus.Pending + byStatus.Approved + byStatus.Rejected;
    res.json({
      total,
      approved: byStatus.Approved,
      pending: byStatus.Pending,
      rejected: byStatus.Rejected,
    });
  } catch (error) {
    next(error);
  }
});

const getString = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";

const getNumber = (value: unknown): number => Number(value);

const ensureRequesterExists = async (userId: number) => {
  const userRepository = appDataSource.getRepository(User);

  const userExists = await userRepository.exist({
    where: { id: userId },
  });

  if (userExists) {
    return;
  }

  await userRepository.insert({
    id: userId,
    name: `Requester #${userId}`,
    role: "Requester",
  });

  await appDataSource.query(
    `SELECT setval(pg_get_serial_sequence('users', 'id'), (SELECT COALESCE(MAX(id), 1) FROM users))`,
  );
};

router.post("/", async (req, res, next) => {
  try {
    const userId = getNumber(req.body?.user_id);
    const startDate = getString(req.body?.start_date);
    const endDate = getString(req.body?.end_date);
    const reason = getString(req.body?.reason);
    const comments = getString(req.body?.comments) || null;

    if (!userId || !startDate || !endDate) {
      return res.status(400).json({
        message: "user_id, start_date and end_date are required",
      });
    }

    await ensureRequesterExists(userId);

    const vacationRequestRepository =
      appDataSource.getRepository(VacationRequest);

    const vacationRequest = vacationRequestRepository.create({
      userId,
      startDate,
      endDate,
      reason,
      comments,
      status: "Pending",
    });

    const createdRequest =
      await vacationRequestRepository.save(vacationRequest);

    res.status(201).json(serializeVacationRequest(createdRequest));
  } catch (error) {
    next(error);
  }
});

router.post("/:id/approve", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({ message: "invalid id" });
    }

    const repository = appDataSource.getRepository(VacationRequest);

    const request = await repository.findOne({
      where: { id },
    });

    if (!request) {
      return res.status(404).json({ message: "vacation request not found" });
    }

    request.status = "Approved";
    request.comments = null;

    const updatedRequest = await repository.save(request);

    res.json(serializeVacationRequest(updatedRequest));
  } catch (error) {
    next(error);
  }
});

const findVacationRequest = async (id: number) => {
  const repository = appDataSource.getRepository(VacationRequest);

  return repository.findOne({
    where: { id },
  });
};

router.post("/:id/reject", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const comments =
      typeof req.body?.comments === "string" ? req.body.comments.trim() : "";

    if (!id) {
      return res.status(400).json({
        message: "invalid id",
      });
    }

    if (!comments) {
      return res.status(400).json({
        message: "comments are required",
      });
    }

    const request = await findVacationRequest(id);

    if (!request) {
      return res.status(404).json({
        message: "vacation request not found",
      });
    }

    request.status = "Rejected";
    request.comments = comments;

    const repository = appDataSource.getRepository(VacationRequest);

    const updatedRequest = await repository.save(request);

    res.json(serializeVacationRequest(updatedRequest));
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "invalid id" });
    }

    const request = await appDataSource
      .getRepository(VacationRequest)
      .findOne({ where: { id } });
    if (!request) {
      return res.status(404).json({ message: "vacation request not found" });
    }

    res.json(serializeVacationRequest(request));
  } catch (error) {
    next(error);
  }
});

export { router as vacationRequestsRoutes };
