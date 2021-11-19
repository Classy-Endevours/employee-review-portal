import { Request, Response } from 'express';
import DB from './db';
import { Types } from 'mongoose';

export class ReviewController {
  public GetByRevId(req: Request, res: Response) {
    const revId = req.params.id;
    DB.Models.Employee.aggregate()
      .match({ 'reviewDocs.revr_id': Types.ObjectId(revId) })
      .unwind('reviewDocs')
      .match({
        'reviewDocs.revr_id': Types.ObjectId(revId),
        'reviewDocs.fb_status': { $ne: 'Approved' }
      })
      .project({
        _id: 1,
        name: 1,
        rating: '$reviewDocs.rating'
      })
      .exec((err, revList) => {
        if (err) {
          res.status(500);
          res.send(err);
        } else {
          console.log(revList, revId);
          res.send(revList);
        }
      });
  }

  public Update(req: Request, res: Response) {
    console.log('req.body._id', req.body._id);
    const revId = req.params.id;
    const rating = req.body.rating;
    const empId = req.body._id;
    DB.Models.Employee.findOneAndUpdate(
      {
        '_id': Types.ObjectId(empId),
        'reviewDocs.revr_id': Types.ObjectId(revId),
        'reviewDocs.fb_status': { $ne: 'Approved' }
      },
      {
        $set: {
          'reviewDocs.$.rating': rating
        }
      },
      (err, emp) => {
        console.log(emp);
        if (!emp) {
          res.status(400);
          res.send({ Type: 'error', message: "Data doesn't exist!" });
          return;
        }
        if (err) {
          res.status(500);
          res.send(err);
        } else {
          res.sendStatus(200);
        }
      }
    );
  }
}
