package inquisite

import "time"

type Comment struct {
	Id     string      `bson:"comment_id" json:"id"`
	Reply  string      `bson:"reply" json:"reply"`
	Body   string      `bson:"body" json:"body"`
	Posted time.Time   `bson:"posted" json:"posted"`
	Author string      `bson:"author" json:"author"`
	Votes  CommentVote `bson:"votes" json:"votes"`
}

type Vote struct {
	Id      string    `bson:"vote_id" json:"id"`
	VoterId string    `bson:"voter_id" json:"voter_id"`
	Cast    time.Time `bson:"cast" json:"cast"`
	Weight  int64     `bson:"weight" json:"weight"`
}

type CommentVote struct {
	Id    string `bson:"comment_id" json:"comment_id"`
	Votes []Vote `bson:"votes" json:"votes"`
}

type PostComment struct {
	AggregateId string    `bson:"aggregate_id" json:"aggregate_id"`
	Comments    []Comment `bson:"comments" json:"comments"`
}
