import { Request, Response } from 'express';
import { EmployeeController } from '../controllers/employee';
import { AuthController } from '../controllers/auth';
import { ReviewController } from '../controllers/review';
import { FeedbackController } from '../controllers/feedback';
import express from 'express';
import { authorize } from '../middleware/auth';
import { Role } from '../models/employee';

export class Routes {
  public employeeController: EmployeeController = new EmployeeController();
  public authController: AuthController = new AuthController();
  public reviewController: ReviewController = new ReviewController();
  public fbController: FeedbackController = new FeedbackController();

  public routes(app: express.Application): void {
    app.route('/').get((req: Request, res: Response) => {
      res.status(200).send({
        message: 'GET request successfulll!!!!'
      });
    });

    app
      .route('/employees')
      .all(authorize(Role.admin))
      .post(this.employeeController.GetAll);

    app
      .route('/employee')
      .post(this.employeeController.Add)
      .put(this.employeeController.Update);

    app
      .route('/employee/:id')
      .get(this.employeeController.GetById)
      .delete(this.employeeController.Delete);
    app
      .route('/reviews/:id')
      .get(this.reviewController.GetByRevId)
      .put(this.reviewController.Update);
    app
      .route('/feedbacks/:id')
      .get(this.fbController.GetFBsByEmpId)
      .put(this.fbController.Update);
    app.route('/authenticate').post(this.authController.Authenticate);
    app.route('/logout');
  }
}
