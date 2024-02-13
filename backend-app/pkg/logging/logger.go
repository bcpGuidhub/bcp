package logging

type BCPLogger interface {
	AddContext(string, interface{}) BCPLogger
	Sync() error
	Clone() BCPLogger
	Debug(string)
	Info(string)
	Warn(string)
	Error(string)
	Fatal(string)
}
