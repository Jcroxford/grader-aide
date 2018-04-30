const ObjectId = require('mongodb').ObjectID;

module.exports = [
  {
    _id: new ObjectId(),
    courseName: 'Object Oriented Programming',
    courseId: 'CS1410',
    studentsEnrolled: [],
    assignments: [
      {
        _id: new ObjectId(),
        name: 'This is the first assignment',
        totalPts: '100',
        rules: [
          {
            desc: 'hello there',
            pts: 2,
            checked: false,
            _id: new ObjectId()
          },
          {
            desc: 'wrong file name',
            pts: -5,
            checked: false,
            _id: new ObjectId()
          }
        ],
        comments: [
          {
            desc: 'some new comment',
            _id: new ObjectId(),
            checked: false
          },
          {
            desc: 'chicken butt',
            _id: new ObjectId(),
            checked: false
          },
          {
            desc: 'a bird in the hand is worth two in the bush',
            _id: new ObjectId(),
            checked: false
          }
        ]
      },
      {
        _id: new ObjectId(),
        name: 'Assignment 5',
        totalPts: '9001',
        rules: [
          {
            desc: 'test test test',
            pts: 123,
            checked: false,
            _id: new ObjectId()
          },
          {
            desc: 'some new rule',
            pts: -5,
            checked: false,
            _id: new ObjectId()
          }
        ],
        comments: [
          {
            desc: 'did you know that a bird in the hand is worth two in the bush?',
            _id: new ObjectId(),
            checked: false
          }
        ]
      },
      {
        _id: new ObjectId(),
        name:
          'This is another test of an assignment that has a super long name. like even longer than the card, bru',
        totalPts: '9001',
        rules: [
          {
            desc: 'fdsafdsa',
            pts: 123,
            checked: false,
            _id: new ObjectId()
          }
        ],
        comments: [
          {
            desc: 'hello there',
            _id: new ObjectId()
          }
        ]
      }
    ]
  },
  {
    _id: new ObjectId(),
    courseName: 'Data Structures and Algorithms',
    courseId: 'CS2420',
    studentsEnrolled: [],
    assignments: [
      {
        _id: new ObjectId(),
        name: 'This is the first assignment',
        totalPts: '100',
        rules: [
          {
            desc: 'hello there',
            pts: 2,
            checked: false,
            _id: new ObjectId()
          },
          {
            desc: 'wrong file name',
            pts: -5,
            checked: false,
            _id: new ObjectId()
          }
        ],
        comments: [
          {
            desc: 'some new comment',
            _id: new ObjectId(),
            checked: false
          },
          {
            desc: 'chicken butt',
            _id: new ObjectId(),
            checked: false
          },
          {
            desc: 'a bird in the hand is worth two in the bush',
            _id: new ObjectId(),
            checked: false
          }
        ]
      },
      {
        _id: new ObjectId(),
        name: 'Assignment 5',
        totalPts: '9001',
        rules: [
          {
            desc: 'test test test',
            pts: 123,
            checked: false,
            _id: new ObjectId()
          },
          {
            desc: 'some new rule',
            pts: -5,
            checked: false,
            _id: new ObjectId()
          }
        ],
        comments: [
          {
            desc: 'did you know that a bird in the hand is worth two in the bush?',
            _id: new ObjectId(),
            checked: false
          }
        ]
      },
      {
        _id: new ObjectId(),
        name:
          'This is another test of an assignment that has a super long name. like even longer than the card, bru',
        totalPts: '9001',
        rules: [
          {
            desc: 'fdsafdsa',
            pts: 123,
            checked: false,
            _id: new ObjectId()
          }
        ],
        comments: [
          {
            desc: 'hello there',
            _id: new ObjectId()
          }
        ]
      }
    ]
  },
  {
    _id: new ObjectId(),
    courseName: 'Fundamentals of Programming',
    courseId: 'CS1400',
    studentsEnrolled: [],
    assignments: []
  }
];
