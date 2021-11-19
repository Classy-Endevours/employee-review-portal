import { Request, Response } from 'express';
import DB from './db';
import { Types } from 'mongoose';

export class FeedbackController {
  public GetFBsByEmpId(req: Request, res: Response) {
    const empId = req.params.id;
    DB.Models.Employee.aggregate([
      { $match: { _id: Types.ObjectId(empId) } },
      { $unwind: '$reviewDocs' },
      {
        $lookup: {
          from: 'employees',
          let: { revrID: '$reviewDocs.revr_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$revrID']
                }
              }
            },
            {
              $project: {
                _id: 1,
                name: 1
              }
            }
          ],
          as: 'reviewer'
        }
      }
    ])
      .unwind('reviewer')
      .project({
        _id: 1,
        name: 1,
        rating: '$reviewDocs.rating',
        fb_status: '$reviewDocs.fb_status',
        reviewer: 1
      })
      .exec((err, revList) => {
        if (err) {
          res.status(500);
          res.send(err);
        } else {
          console.log(revList, empId);
          res.send(revList);
        }
      });
  }

  public Update(req: Request, res: Response) {
    console.log('req.body._id', req.body._id);
    const empId = req.params.id;
    const fb_status = req.body.fb_status;
    const revrId = req.body.reviewer._id;
    DB.Models.Employee.findOneAndUpdate(
      { '_id': empId, 'reviewDocs.revr_id': revrId },
      { $set: { 'reviewDocs.$.fb_status': fb_status } },
      (err, emp) => {
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
