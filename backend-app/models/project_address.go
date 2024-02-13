package models

import (
	"bytes"
	"database/sql/driver"
	"encoding/binary"
	"encoding/hex"
	"fmt"
)

type ProjectAddress struct {
	Model
	ID               string  `gorm:"primary_key;column:project_id" json:"id"`
	Project          Project `gorm:"foreignkey:project_id"`
	PostalCode       string  `gorm:"column:postal_code" json:"postal_code"`
	City             string  `gorm:"column:city" json:"city"`
	Address          string  `gorm:"column:address" json:"address"`
	GeographicalArea Point   `gorm:"type:geometry;column:geographical_area" json:"geographical_area"`
}

// Set ProjectAddress's table name to be `project_address`
func (ProjectAddress) TableName() string {
	return "project_address"
}

type Point struct {
	Lng float64 `json:"lng"`
	Lat float64 `json:"lat"`
}

func (p *Point) String() string {
	return fmt.Sprintf("SRID=4326;POINT(%v %v)", p.Lng, p.Lat)
}

func (p *Point) Scan(val interface{}) error {
	b, err := hex.DecodeString(string(val.([]uint8)))
	if err != nil {
		return err
	}
	r := bytes.NewReader(b)
	var wkbByteOrder uint8
	if err := binary.Read(r, binary.LittleEndian, &wkbByteOrder); err != nil {
		return err
	}

	var byteOrder binary.ByteOrder
	switch wkbByteOrder {
	case 0:
		byteOrder = binary.BigEndian
	case 1:
		byteOrder = binary.LittleEndian
	default:
		return fmt.Errorf("Invalid byte order %d", wkbByteOrder)
	}

	var wkbGeometryType uint64
	if err := binary.Read(r, byteOrder, &wkbGeometryType); err != nil {
		return err
	}

	if err := binary.Read(r, byteOrder, p); err != nil {
		return err
	}

	return nil
}

func (p Point) Value() (driver.Value, error) {
	return p.String(), nil
}

type NullPoint struct {
	Point Point
	Valid bool
}

func (np *NullPoint) Scan(val interface{}) error {
	if val == nil {
		np.Point, np.Valid = Point{}, false
		return nil
	}

	point := &Point{}
	err := point.Scan(val)
	if err != nil {
		np.Point, np.Valid = Point{}, false
		return nil
	}
	np.Point = Point{
		Lat: point.Lat,
		Lng: point.Lng,
	}
	np.Valid = true

	return nil
}

func (np NullPoint) Value() (driver.Value, error) {
	if !np.Valid {
		return nil, nil
	}
	return np.Point, nil
}
