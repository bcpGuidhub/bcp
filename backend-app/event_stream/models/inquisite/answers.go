package inquisite

import "time"

type PostAnswer struct {
	Id              string               `bson:"_id" json:"id"`
	AggregateId     string               `bson:"aggregate_id" json:"aggregate_id"`
	Author          string               `bson:"author" json:"author"`
	Revisions       []PostAnswerRevision `bson:"revisions" json:"revisions"`
	Votes           []PostVote           `bson:"votes" json:"votes"`
	RevisionAuthors []RevisionAuthor     `json:"revision_authors"`
}

type PostAnswerRevision struct {
	Id       string    `bson:"revision_id" json:"id"`
	Body     string    `bson:"body" json:"body"`
	Posted   time.Time `json:"posted"`
	AuthorId string    `bson:"author" json:"author_id"`
}
