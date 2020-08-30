const fs = require('fs');
const xlsx = require('node-xlsx');
const prompts = require('prompts');

const questions = [
    {
        type: 'number',
        name: 'nameCol',
        message: '发起人姓名列'
    },
    {
        type: 'number',
        name: 'dateCol',
        message: '日期列'
    },
    {
        type: 'number',
        name: 'workCol',
        message: '工作时长列',
        initial: 'Why should I?'
    },
    {
        type: 'number',
        name: 'sheetNum',
        message: '第几个sheet需要处理',
    }
];

prompts(questions).then(function(v) {
    console.log('excel导出中')
    dealExcel(v.nameCol, v.dateCol, v.workCol, v.sheetNum)
})

// 10 15 36 5 第一个参数表示姓名列， 日期列 工作时长列 第几个sheet需要处理,自行修改参数
function dealExcel(nameCol, dateCol, workCol, sheetNum) {
    const sheets = xlsx.parse('test.xlsx');//获取到所有sheets
    let alldata = {}
    nameCol = nameCol -1;
    dateCol = dateCol - 1;
    workCol = workCol - 1;
    let sheet = sheets[sheetNum-1]
    for(let rowId in sheet['data']){
        let row=sheet['data'][rowId];
        dealData(row, alldata)
    }
    delete alldata['发起人姓名'];
    delete alldata['undefined'];
    write(alldata);
    showMoreThan8hour(alldata)
    // 名字相同和时间相同的一共是多少
    console.log('excel导出结束')
    function dealData(row, alldata) {
        if(!alldata[row[nameCol]]) {
            alldata[row[nameCol]] = {}
        }
        alldata[row[nameCol]][row[dateCol]] = +alldata[row[nameCol]][row[dateCol]] || 0;
        alldata[row[nameCol]][row[dateCol]]+=+row[workCol];
    }
    function write(data) {
        let result = [{
            name : '工时统计',
            data : [
                [
                    '办事处',
                    '姓名',
                    '工时总计（h）',
                    '超时情况'
                ],
            ]
        }]
        Object.keys(data).forEach(function(item) {
            let count = 0
            Object.keys(data[item]).forEach(function(it){
                count += data[item][it]
            })
            result[0].data.push([
                '浙闽办', item, count+'', showMoreThan8hour(data[item])
            ])
        })

        let buffer = xlsx.build(result);
        fs.writeFile('./工时统计.xlsx', buffer, function (err)
            {
                if (err)
                    throw err;
                console.log('完成excel导出命名为 工时统计.xls');
            }
        );
    }

    function showMoreThan8hour(data) {
        const date = [];
        Object.keys(data).forEach(function(it){
            if(data[it] > 8) {
                date.push(it)
            }
        })
        if(date.length === 0) {
            return '无'
        }
        return date.join('，') + '超过8小时'
    }
}
