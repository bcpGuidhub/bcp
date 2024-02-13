package commands

import "google.golang.org/protobuf/proto"

type (
	CommandType string
)

const (
	CommandTypeAddPost               CommandType = "c_add_post"
	CommandTypeAddAnswerToPost       CommandType = "c_add_answer"
	CommandTypeEditPost              CommandType = "c_add_revision_post"
	CommandTypeAddRevisionToAnswer   CommandType = "c_add_revision_answer"
	CommandTypeCommentOnPost         CommandType = "c_comment_post"
	CommandTypeCommentOnAnswer       CommandType = "c_comment_on_answer"
	CommandTypeFlagComment           CommandType = "c_flag_comment"
	CommandTypeRetractFlagComment    CommandType = "c_retract_flag_comment"
	CommandTypeFlagAnswer            CommandType = "c_flag_answer"
	CommandTypeRetractFlagAnswer     CommandType = "c_retract_flag_answer"
	CommandTypeFlagPost              CommandType = "c_flag_post"
	CommandTypeRetractFlagPost       CommandType = "c_retract_flag_post"
	CommandTypeVoteUpPost            CommandType = "c_vote_up_post"
	CommandTypeRetractVoteUpPost     CommandType = "c_retract_vote_up_post"
	CommandTypeVoteDownPost          CommandType = "c_vote_down_post"
	CommandTypeRetractVoteDownPost   CommandType = "c_retract_vote_down_post"
	CommandTypeVoteUpAnswer          CommandType = "c_vote_up_answer"
	CommandTypeRetractVoteUpAnswer   CommandType = "c_retract_vote_up_answer"
	CommandTypeVoteDownAnswer        CommandType = "c_vote_down_answer"
	CommandTypeRetractVoteDownAnswer CommandType = "c_retract_vote_down_answer"
	CommandTypeVoteUpComment         CommandType = "c_vote_up_comment"
	CommandTypeRetractVoteUpComment  CommandType = "c_retract_vote_up_comment"
	CommandTypeAcceptAnswer          CommandType = "c_accept_answer"
	CommandTypeRetractAcceptAnswer   CommandType = "c_retract_accept_answer"
)

type ICommand interface {
	GetPayload() proto.Message
}

type Command struct {
	Payload proto.Message
}

func (cmd *Command) GetPayload() proto.Message {
	return cmd.Payload
}

type AddPost struct {
	*Command
}

type PostAnswer struct {
	*Command
}

type AddRevisionToPost struct {
	*Command
}

type AddRevisionToAnswer struct {
	*Command
}

type CommentOnPost struct {
	*Command
}

type CommentOnAnswer struct {
	*Command
}

type FlagComment struct {
	*Command
}

type RetractFlagComment struct {
	*Command
}

type FlagAnswer struct {
	*Command
}

type RetractFlagAnswer struct {
	*Command
}

type FlagPost struct {
	*Command
}

type RetractFlagPost struct {
	*Command
}

type VoteUpPost struct {
	*Command
}

type RetractVoteUpPost struct {
	*Command
}

type VoteUpAnswer struct {
	*Command
}

type RetractVoteUpAnswer struct {
	*Command
}

type VoteUpComment struct {
	*Command
}

type RetractVoteUpComment struct {
	*Command
}

type VoteDownPost struct {
	*Command
}

type RetractVoteDownPost struct {
	*Command
}

type VoteDownAnswer struct {
	*Command
}

type RetractVoteDownAnswer struct {
	*Command
}

type AcceptAnswer struct {
	*Command
}

type RetractAcceptAnswer struct {
	*Command
}
