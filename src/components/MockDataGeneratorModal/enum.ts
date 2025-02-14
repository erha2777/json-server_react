export interface Option {
    value: string;
    label: string;
    children?: Option[];
}
const options: Option[] = [
    {
        value: 'String',
        label: '字符串',
        children: [
            {
                value: 'min-max',
                label: '复制次数（范围中随机）',
            },
            {
                value: 'count',
                label: '复制总次数',
            },
        ],
    },
    {
        value: 'Number',
        label: '数字',
        children: [
            {
                value: '+1',
                label: '递增',
            },
            {
                value: 'min-max',
                label: '整数（范围中随机）',
            },
            {
                value: 'min-max.dmin-dmax',
                label: '小数（范围中随机）',
            }
        ],
    },
    {
        value: 'Boolean',
        label: '布尔',
        children: [
            {
                value: '1',
                label: '1:1',
            },
            {
                value: 'min-max',
                label: 'x:y',
            }
        ],
    },
    {
        value: 'Object',
        label: '对象',
        children: [
            {
                value: 'count',
                label: '对象中拿几条属性',
            },
            {
                value: 'min-max',
                label: '对象中拿几条属性（范围中随机）',
            }
        ],
    },
    {
        value: 'Array',
        label: '数组',
        children: [
            {
                value: '1',
                label: '数组中取随机一条',
            },
            {
                value: '+1',
                label: '数组按顺序取',
            },
            {
                value: 'min-max',
                label: '数组长度（范围中随机）',
            },
            {
                value: 'count',
                label: '数组总长度',
            },
            {
                value: 'range',
                label: '快速生成数字数组',
            }
        ],
    },
    {
        value: 'Function',
        label: '方法',
        children: [
            {
                value: 'function',
                label: '取实例上的其他属性值',
            },
        ],
    },
    {
        value: 'Date',
        label: '时间',
        children: [
            {
                value: 'date',
                label: "生成日期",
            },
            {
                value: 'time',
                label: "生成时间",
            },
            {
                value: 'datetime',
                label: "生成日期时间",
            },
            {
                value: 'now',
                label: '生成最新时间',
            },
        ],
    },
    {
        value: 'RegExp',
        label: '正则',
    },
    // {
    //     value: 'Path',
    //     label: '路径',
    //     children: [
    //         {
    //             value: 'absolute',
    //             label: "绝对路径",
    //         },
    //         {
    //             value: 'relative',
    //             label: "相对路径",
    //         },
    //     ],
    // },
    {
        value: 'Image',
        label: '图片',
    },
    {
        value: 'Color',
        label: '颜色',
    },
    {
        value: 'Text',
        label: '文字',
        children: [
            {
                value: 'cparagraph',
                label: '中文段落',
            },
            {
                value: 'csentence',
                label: '中文句子',
            },
            {
                value: 'cword',
                label: '中文单词',
            },
            {
                value: 'ctitle',
                label: '中文标题',
            },
            {
                value: 'paragraph',
                label: '英语段落',
            },
            {
                value: 'sentence',
                label: '英语句子',
            },
            {
                value: 'word',
                label: '英语单词',
            },
            {
                value: 'title',
                label: '英语标题',
            }
        ],
    },
    {
        value: 'Name',
        label: '名字',
        children: [
            {
                value: 'cfirst',
                label: '中文姓',
            },
            {
                value: 'clast',
                label: '中文名',
            },
            {
                value: 'cname',
                label: '中文姓名',
            },
            {
                value: 'first',
                label: '英语名',
            },
            {
                value: 'last',
                label: '英语姓',
            },
            {
                value: 'name',
                label: '英语姓名',
            },
        ],
    },
    {
        value: 'Web',
        label: 'Web',
        children: [
            {
                value: 'url',
                label: '网址',
            },
            {
                value: 'domain',
                label: '域名',
            },
            {
                value: 'protocol',
                label: '协议',
            },
            {
                value: 'tld',
                label: '顶级域名',
            },
            {
                value: 'email',
                label: '电子邮件',
            },
            {
                value: 'ip',
                label: 'ip地址',
            },
        ],
    },
    {
        value: 'Address',
        label: '地址',
        children: [
            {
                value: 'region',
                label: '区域',
            },
            {
                value: 'province',
                label: '省份',
            },
            {
                value: 'city',
                label: '都市',
            },
            {
                value: 'county',
                label: '县',
            }
        ],
    },
    {
        value: 'Miscellaneous',
        label: '其他',
        children: [
            {
                value: 'guid',
                label: '全局唯一标识符',
            },
            {
                value: 'id',
                label: '身份证标识号',
            },
            {
                value: 'increment',
                label: '增量',
            }
        ],
    },
];

export default options