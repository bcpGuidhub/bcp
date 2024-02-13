package eventstream

type Writer interface {
	Write(messages ...*Message) error
	Close() error
}
