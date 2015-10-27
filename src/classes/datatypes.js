var PQL_CONFIG = require('./../config/pql_config');

class DATATYPE {}
class DATATYPE_NUMBER extends DATATYPE {
    static getPQLType () {
        return PQL_CONFIG.NUMERIC;
    }
}
class DATATYPE_STRING extends DATATYPE {
    static getPQLType () {
        return PQL_CONFIG.STRING;
    }
}
class DATATYPE_INTEGER extends DATATYPE_NUMBER {}
class DATATYPE_REAL extends DATATYPE_NUMBER {
    static get default_size () {
        return null;
    }
}
class DATATYPE_DATE extends DATATYPE {
    static getPQLType () {
        return PQL_CONFIG.DATE;
    }
    static get default_size () {
        return null;
    }
}
class DATATYPE_CHAR extends DATATYPE_STRING {}
class DATATYPE_BINARY extends DATATYPE_STRING {}

// integers
class BOOLEAN extends DATATYPE_INTEGER {
    static getPQLType () {
        return PQL_CONFIG.BOOLEAN;
    }
    static get default_size () {
        return 1;
    }
}
class INT8 extends DATATYPE_INTEGER {
    static get default_size () {
        return 4;
    }
}
class UINT8 extends DATATYPE_INTEGER {
    static get default_size () {
        return 3;
    }
}
class INT16 extends DATATYPE_INTEGER {
    static get default_size () {
        return 6;
    }
}
class UINT16 extends DATATYPE_INTEGER {
    static get default_size () {
        return 5;
    }
}
class INT32 extends DATATYPE_INTEGER {
    static get default_size () {
        return 11;
    }
}
class UINT32 extends DATATYPE_INTEGER {
    static get default_size () {
        return 10;
    }
}
class INT64 extends DATATYPE_INTEGER {
    static get default_size () {
        return 20;
    }
}
class UINT64 extends DATATYPE_INTEGER {
    static get default_size () {
        return 20;
    }
}
// numeric
class FLOAT extends DATATYPE_REAL { }
class DOUBLE extends DATATYPE_REAL { }
// date
class DATE extends DATATYPE_DATE { }
class TIME extends DATATYPE_DATE { }
class DATETIME extends DATATYPE_DATE { }
// char
class CHAR extends DATATYPE_CHAR {
    static get default_size () {
        return 32;
    }
}
class VARCHAR extends DATATYPE_CHAR {
    static get default_size () {
        return 255;
    }
}
class TEXT extends DATATYPE_CHAR {
    static get default_size () {
        return null;
    }
}
// binary
class BINARY extends DATATYPE_BINARY {
    static get default_size () {
        return 32;
    }
}
class VARBINARY extends DATATYPE_BINARY {
    static get default_size () {
        return 255;
    }
}
class IMAGE extends DATATYPE_BINARY {
    static get default_size () {
        return null;
    }
}
// special
class GUID extends BINARY {
    static get default_size () {
        return 32;
    }
}
class MONEY extends INT32 { }

DATATYPE.DATATYPE_NUMBER    = DATATYPE_NUMBER;
DATATYPE.DATATYPE_STRING    = DATATYPE_STRING;
DATATYPE.DATATYPE_INTEGER   = DATATYPE_INTEGER;
DATATYPE.DATATYPE_REAL      = DATATYPE_REAL;
DATATYPE.DATATYPE_DATE      = DATATYPE_DATE;
DATATYPE.DATATYPE_CHAR      = DATATYPE_CHAR;
DATATYPE.DATATYPE_BINARY    = DATATYPE_BINARY;
DATATYPE.BOOLEAN            = BOOLEAN;
DATATYPE.INT8               = INT8;
DATATYPE.UINT8              = UINT8;
DATATYPE.INT16              = INT16;
DATATYPE.UINT16             = UINT16;
DATATYPE.INT32              = INT32;
DATATYPE.UINT32             = UINT32;
DATATYPE.INT64              = INT64;
DATATYPE.UINT64             = UINT64;
DATATYPE.FLOAT              = FLOAT;
DATATYPE.DOUBLE             = DOUBLE;
DATATYPE.DATE               = DATE;
DATATYPE.TIME               = TIME;
DATATYPE.DATETIME           = DATETIME;
DATATYPE.CHAR               = CHAR;
DATATYPE.VARCHAR            = VARCHAR;
DATATYPE.TEXT               = TEXT;
DATATYPE.BINARY             = BINARY;
DATATYPE.VARBINARY          = VARBINARY;
DATATYPE.IMAGE              = IMAGE;
DATATYPE.GUID               = GUID;
DATATYPE.MONEY              = MONEY;

module.exports = DATATYPE;