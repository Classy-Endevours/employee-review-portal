db.employee.insertMany([{name: 'admin'}, {name: 'employee'}])

admin - 5e7053350d0dafd56ab0ce5f
employee - 5e7053350d0dafd56ab0ce60

db.employee.update({ name: 'admin'}, { $push: { reviewDocs: { revr_id: ObjectId('5e7053350d0dafd56ab0ce60')}}})
db.employee.update({ name: 'employee'}, { $push: { reviewDocs: { revr_id: ObjectId('5e7053350d0dafd56ab0ce5f')}}})



db.employees.aggregate([
  { $match: { _id: ObjectId('5e7066d9dfcd20066aafc453') } },
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
      // localField: 'reviewDocs.revr_id',
      // foreignField: '_id',
      as: 'reviewer'
    }
  }
]);
