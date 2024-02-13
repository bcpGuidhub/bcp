package inquisite

import "time"

type TagLabel struct {
	Id    string
	Label string
}

type TagModification struct {
	Author           string
	Description      string
	ModificationDate time.Time
}

type TagDescription struct {
	Id              string                       `bson:"_id" json:"id"`
	TagLabelId      string                       `bson:"tag_label_id" json:"tag"`
	RevisionHistory []map[string]TagModification `json:"revision_history"`
}
