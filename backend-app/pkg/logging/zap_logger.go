package logging

import (
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

// BCPZapLogger is a BCP specific zap logger.
type BCPZapLogger struct {
	*zap.Logger
}

// NewBCPZapLogger creates a BCP specific zap logger that
// implements the BCPLogger interface.
func NewBCPZapLogger(logLevel string) (BCPLogger, error) {
	level, err := newZapLevel(logLevel)

	if err != nil {
		return nil, err
	}

	zapLogger, err := newZapConfig(level).Build()

	if err != nil {
		return nil, err
	}

	return &BCPZapLogger{zapLogger}, nil
}

// AddContext adds contextual information into the underlying zap.Logger,
// which creates a clone that we assign as our zap.Logger.
func (BCPlg *BCPZapLogger) AddContext(key string, values interface{}) BCPLogger {
	BCPlg.Logger = BCPlg.WithOptions(zap.Fields(zap.Any(key, values)))
	return BCPlg
}

// Clone creates a copy of this zap logger, often used for creating
// separate contextual data.
func (BCPlg *BCPZapLogger) Clone() BCPLogger {
	dup := *BCPlg
	return &dup
}

// Debug overrides the underlying logger implementation, removing references
// to contextual zap.Fields
func (BCPlg *BCPZapLogger) Debug(message string) {
	BCPlg.Logger.Debug(message)
}

// Info overrides the underlying logger implementation, removing references
// to contextual zap.Fields
func (BCPlg *BCPZapLogger) Info(message string) {
	BCPlg.Logger.Info(message)
}

// Warn overrides the underlying logger implementation, removing references
// to contextual zap.Fields
func (BCPlg *BCPZapLogger) Warn(message string) {
	BCPlg.Logger.Warn(message)
}

// Error overrides the underlying logger implementation, removing references
// to contextual zap.Fields
func (BCPlg *BCPZapLogger) Error(message string) {
	BCPlg.Logger.Error(message)
}

// Fatal overrides the underlying logger implementation, removing references
// to contextual zap.Fields
func (BCPlg *BCPZapLogger) Fatal(message string) {
	BCPlg.Logger.Fatal(message)
}

// Sync flushes any buffered log entries.
// Processes should normally take care to call Sync before exiting.
func (BCPlg *BCPZapLogger) Sync() error {
	var err error
	err = BCPlg.Logger.Sync()
	return err
}

func newZapLevel(text string) (zapcore.Level, error) {
	var l zapcore.Level
	err := l.Set(text)
	return l, err
}

func newZapConfig(level zapcore.Level) zap.Config {
	return zap.Config{
		Encoding:    "json",
		Level:       zap.NewAtomicLevelAt(level),
		OutputPaths: []string{"stdout"},
		EncoderConfig: zapcore.EncoderConfig{
			MessageKey:     "message",
			LevelKey:       "severity",
			EncodeLevel:    zapcore.LowercaseLevelEncoder,
			TimeKey:        "time",
			EncodeTime:     zapcore.ISO8601TimeEncoder,
			EncodeDuration: zapcore.SecondsDurationEncoder,
		},
	}
}
