package message

type IErrorMessage interface {
	Error() (uint32, error)
	ErrorMessage() string
}

type MsError struct {
	Code    uint32      `json:"code"`
	Short   string      `json:"error"`
	Payload interface{} `json:"payload"`
	error   error
}

func (err MsError) Error() (uint32, error) {
	return err.Code, err.error
}

func (err MsError) ErrorMessage() string {
	return err.Short
}

func NewErrorMessage(errCode uint32, err error) IErrorMessage {
	return MsError{Code: errCode, Short: err.Error(), error: err}
}

func ErrorMessage(code uint32, err error, sessionUUID string, payload interface{}) *Message {

	return &Message{
		RecipientsSessionUUID: []string{sessionUUID},
		Type:                  MessageTypeError,
		Error: &MsError{
			Code:    code,
			Short:   err.Error(),
			Payload: payload,
			error:   err,
		},
	}
}
