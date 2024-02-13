package logging

type contextKey struct {
	name string
}

func (c contextKey) String() string {
	return "bored utility context key " + c.name
}
