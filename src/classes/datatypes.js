class DATATYPE_NUMBER {}
class DATATYPE_STRING {}
class DATATYPE_INTEGER extends DATATYPE_NUMBER {}
class DATATYPE_REAL extends DATATYPE_NUMBER {}
class DATATYPE_DATE {}
class DATATYPE_CHAR extends DATATYPE_STRING {}
class DATATYPE_BINARY extends DATATYPE_STRING {}

// integers
class BOOLEAN extends DATATYPE_INTEGER { }
class INT8 extends DATATYPE_INTEGER { }
class UINT8 extends DATATYPE_INTEGER { }
class INT16 extends DATATYPE_INTEGER { }
class UINT16 extends DATATYPE_INTEGER { }
class INT32 extends DATATYPE_INTEGER { }
class UINT32 extends DATATYPE_INTEGER { }
class INT64 extends DATATYPE_INTEGER { }
class UINT64 extends DATATYPE_INTEGER { }
// numeric
class FLOAT extends DATATYPE_REAL { }
class DOUBLE extends DATATYPE_REAL { }
// date
class DATE extends DATATYPE_DATE {}
class TIME extends DATATYPE_DATE {}
class DATETIME extends DATATYPE_DATE { }
// char
class CHAR extends DATATYPE_CHAR { }
class VARCHAR extends DATATYPE_CHAR { }
class TEXT extends DATATYPE_CHAR { }
// binary
class BINARY extends DATATYPE_BINARY { }
class VARBINARY extends DATATYPE_BINARY { }
class IMAGE extends DATATYPE_BINARY { }
// special
class GUID extends CHAR { }
class MONEY extends INT32 { }

const DATATYPES = {
    DATATYPE_NUMBER,
    DATATYPE_STRING,
    DATATYPE_INTEGER,
    DATATYPE_REAL,
    DATATYPE_DATE,
    DATATYPE_CHAR,
    DATATYPE_BINARY,
    BOOLEAN,
    INT8,
    UINT8,
    INT16,
    UINT16,
    INT32,
    UINT32,
    INT64,
    UINT64,
    FLOAT,
    DOUBLE,
    DATE,
    TIME,
    DATETIME,
    CHAR,
    VARCHAR,
    TEXT,
    BINARY,
    VARBINARY,
    IMAGE,
    GUID,
    MONEY,
};

module.exports = {
    DATATYPE_NUMBER,

    DATATYPE_STRING,
    DATATYPE_INTEGER,
    DATATYPE_REAL,
    DATATYPE_DATE,
    DATATYPE_CHAR,
    DATATYPE_BINARY,
    BOOLEAN,
    INT8,
    UINT8,
    INT16,
    UINT16,
    INT32,
    UINT32,
    INT64,
    UINT64,
    FLOAT,
    DOUBLE,
    DATE,
    TIME,
    DATETIME,
    CHAR,
    VARCHAR,
    TEXT,
    BINARY,
    VARBINARY,
    IMAGE,
    GUID,
    MONEY,
    DATATYPES,
};