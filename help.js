https://github.com/neetocode/mongodb-university/blob/master/m121/chapter02/lab02.js
https://github.com/Kmwai/m121/tree/master/chap_3

#LAB1

var pipeline = [
    {
        $match: {
            'imdb.rating': { $gte: 7 },
            'genres': { $nin: ['Crime', 'Horror'] },
            'rated': { $in: ['PG', 'G'] },
            $and: [{ 'languages': 'English' }, { 'languages': 'Japanese' }]
        }
    }
]

#LAB2

var pipeline = [
    {
        $match: {
            'imdb.rating': { $gte: 7 },
            'genres': { $nin: ['Crime', 'Horror'] },
            'rated': { $in: ['PG', 'G'] },
            $and: [{ 'languages': 'English' }, { 'languages': 'Japanese' }]
        }
    },
    {
        $project: {
            title: 1,
            rated: '$imdb.rating',
            _id: 0
        }
    }
]

#LAB3

db.movies.aggregate([
    {
        $project: {
        _id:0,
        titleLengths: {$split: ["$title", " "]},
        title:1
        }
    },
    {
        $match:{titleLengths : { $size: 1 }}
    }
]).itcount()

#LAB4


favorites = ["Sandra Bullock","Tom Hanks","Julia Roberts","Kevin Spacey","George Clooney"]

var pipeline = [
            {
            "$project":{"_id":0,"title":1,"num_favs":{"$size":{"$setIntersection": [ "$cast",favorites]}} },
            },
            {
            "$sort":{"num_favs":-1},
            },
            ]
            var pipeline = [
    {
        $match: {
            'tomatoes.viewer.rating': { $gte: 3 },
            countries: 'USA'
        }
    },
    {
        $project: {
            _id: 0,
            'num_favs': {
                $size: {
                    $ifNull: [
                        {
                            $filter: {
                                input: "$cast",
                                as: "cast",
                                cond: { $in: ["$$cast", favorites] }
                            }
                        },
                        []
                    ]
                }
                ,
            },
            // cast: 1,
            title: 1,
            'rating': '$tomatoes.viewer.rating'
            // count: { $sum: '$_id' }
        }
    },
    { $sort: { 'num_favs': -1, 'rating': -1,'title':-1 } },
    { $limit: 25 }
]

#LAB5

x_max = 1521105
x_min = 5
min = 1
max = 10


var pipeline = [
    {
        $match: {
            'imdb.rating': { $gte: 1 },
            // 'imdb.votes': { $gte: 1 },
            'released': { $gte: ISODate("1990-01-01") },
            languages: 'English'
        }
    },
    {
        $project: {
            _id: 0,
            title: 1,
            normalized_rating: {
                $avg: [
                    {
                        $add: [
                            1,
                            {
                                $multiply: [
                                    9,
                                    {
                                        $divide: [
                                            { $subtract: ['$imdb.votes', x_min] },
                                            { $subtract: [x_max, x_min] }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    '$imdb.rating'
                ]
            }
        }
    },
    {
        $sort: { 'normalized_rating': 1 }
    },
    { $limit: 5 },
]


#LAB $group and Accumulators

db.movies.aggregate([
    {
        $match: {
            'awards': /Won.\d*.[oO]scars?/
        }
    },
    {
        $group: {
            _id: null,
            highest_rating: { $max: '$imdb.rating' },
            lowest_rating: { $min: '$imdb.rating' },
            average_rating: { $avg: '$imdb.rating' },
            deviation: { $stdDevSamp: '$imdb.rating' }
        }
    }
])
