import { GetMappedValue } from './index';
/*

V7.3.6 and V8.5.6 and V9.0.1 angular Value Maps JSON

"valueMaps": [
  {
    "op": "=",
    "text": "N/A",
    "value": "null"
  },
  {
    "op": "=",
    "text": "V7_TEXT",
    "value": "20"
  }
],

The valueMappings however come in 2 different structures depending on the runtime.

V7.3.10

[
  {
    "op":"=",
    "text":"N/A",
    "value":"null",
    "id":0,
    "type":1
  },
  {
    "op":"=",
    "text":"V7_TEXT",
    "value":"20",
    "id":1,
    "type":1
  }
]
V8.5.6 and V9.0.1

[
  {
    "type":"special",
    "options":{
      "match":"null",
      "result":{
        "text":"N/A"
      }
    }
  },
  {
    "type":"value",
    "options":{
      "20":{
        "text":"V8_9_TEXT"
      }
    }
  }
]

what about rangeMaps?

"rangeMaps": [
    {
      "from": "null",
      "text": "N/A",
      "to": "null"
    },
    {
      "from": "10",
      "to": "20",
      "text": "V7_TEXT"
    }
  ],

  V7 Object
  [
    {
      "from":"null",
      "text":"N/A",
      "to":"null",
      "id":0,
      "type":2
    },
    {
      "from":"10",
      "to":"20",
      "text":"V7_TEXT",
      "id":1,
      "type":2
    }
  ]

  V8/V9 Object

  [
    {
      "type":"special",
      "options":{
        "match":"null",
        "result":{
          "text":"N/A"
        }
      }
    },
    {
      "type":"range",
      "options":{
        "from":10,
        "to":20,
        "result":{
          "text":"V8_9_TEXT"
        }
      }
    }
  ]

*/

describe('valueMappings', () => {
  const v7mappings = [
    {
      op: '=',
      text: 'N/A',
      value: 'null',
      id: 0,
      type: 1,
    },
    {
      op: '=',
      text: 'V7_TEXT',
      value: '20',
      id: 1,
      type: 1,
    },
  ];
  const v8mappings = [
    {
      type: 'special',
      options: {
        match: 'null',
        result: {
          text: 'N/A',
        },
      },
    },
    {
      type: 'range',
      options: {
        from: 10,
        to: 20,
        result: {
          text: 'V8_9_TEXT',
        },
      },
    },
  ];
  describe('With v7 data', () => {
    it('returns MY_TEXT', () => {
      const result = GetMappedValue(v7mappings, 20);
      expect(result.text).toEqual('V7_TEXT');
    });
  });
  describe('With v8 data', () => {
    it('returns MY_TEXT', () => {
      const result = GetMappedValue(v8mappings, 20);
      expect(result.text).toEqual('V8_9_TEXT');
    });
  });
});
