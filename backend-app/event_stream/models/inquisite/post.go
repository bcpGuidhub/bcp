package inquisite

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type PostRevision struct {
	Id          string    `bson:"revision_id" json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Posted      time.Time `json:"posted"`
	Summary     string    `bson:"edit_summary" json:"edit_summary"`
	AuthorId    string    `bson:"author" json:"author_id"`
}

type RevisionAuthor struct {
	Email        string `json:"email"`
	ID           string `json:"author_id"`
	FirstName    string `json:"first_name"`
	LastName     string `json:"last_name"`
	ProfileImage string `json:"profile_image"`
}

type PostVote struct {
	Id      string    `bson:"vote_id" json:"id"`
	VoterId string    `bson:"voter_id" json:"voter_id"`
	Cast    time.Time `bson:"cast" json:"cast"`
	Weight  int64     `bson:"weight" json:"weight"`
}

type ActivePost struct {
	Author          string           `bson:"author" json:"author"`
	AggregateId     string           `bson:"aggregate_id" json:"id"`
	Revisions       []PostRevision   `bson:"revisions" json:"revisions"`
	Votes           []PostVote       `bson:"votes" json:"votes"`
	RevisionAuthors []RevisionAuthor `json:"revision_authors"`
}

type PostUITags struct {
	Id          string         `json:"id"`
	Label       string         `json:"label"`
	Description TagDescription `json:"description"`
	Count       int64          `json:"count"`
	AggregateId string         `json:"aggregate_id"`
}

type PostTags struct {
	AggregateId string             `bson:"aggregate_id" json:"aggregate_id"`
	Id          primitive.ObjectID `bson:"_id" json:"id"`
	LabelId     primitive.ObjectID `bson:"tag_label_id"`
}
