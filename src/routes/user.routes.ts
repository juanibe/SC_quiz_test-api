import { Router } from 'express';

import { userController } from '../controllers/user.controller'

const router: Router = Router();

router.get("/", userController.getAll);
router.get("/:id", userController.get);
router.post("/", userController.create);
router.put("/:id", userController.update);

export default router;

