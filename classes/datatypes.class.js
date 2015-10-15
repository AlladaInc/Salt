export class DATATYPE_NUMBER {}
export class DATATYPE_STRING {}
export class DATATYPE_INTEGER extends DATATYPE_NUMBER {}
export class DATATYPE_REAL extends DATATYPE_NUMBER {}
export class DATATYPE_DATE {}
export class DATATYPE_CHAR extends DATATYPE_STRING {}
export class DATATYPE_BINARY extends DATATYPE_STRING {}

// integers
export class BOOLEAN extends DATATYPE_INTEGER { }
export class INT8 extends DATATYPE_INTEGER { }
export class UINT8 extends DATATYPE_INTEGER { }
export class INT16 extends DATATYPE_INTEGER { }
export class UINT16 extends DATATYPE_INTEGER { }
export class INT32 extends DATATYPE_INTEGER { }
export class UINT32 extends DATATYPE_INTEGER { }
export class INT64 extends DATATYPE_INTEGER { }
export class UINT64 extends DATATYPE_INTEGER { }
// numeric
export class FLOAT extends DATATYPE_REAL { }
export class DOUBLE extends DATATYPE_REAL { }
// date
export class DATE extends DATATYPE_DATE {}
export class TIME extends DATATYPE_DATE {}
export class DATETIME extends DATATYPE_DATE { }
// char
export class CHAR extends DATATYPE_CHAR { }
export class VARCHAR extends DATATYPE_CHAR { }
export class TEXT extends DATATYPE_CHAR { }
// binary
export class BINARY extends DATATYPE_BINARY { }
export class VARBINARY extends DATATYPE_BINARY { }
export class IMAGE extends DATATYPE_BINARY { }
// special
export class GUID extends CHAR { }
export class MONEY extends INT32 { }

export const DATATYPES = {
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
export default DATATYPES;