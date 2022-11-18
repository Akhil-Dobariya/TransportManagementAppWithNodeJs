function GetYYYYMMDDdate(date){
    console.log('Input '+date);
    var tempDate = new Date(date);

        var year = `${tempDate.getUTCFullYear()}`;
        var month = `${("0"+(tempDate.getUTCMonth()+1)).slice(-2)}`;
        var datee = `${("0"+tempDate.getUTCDate()).slice(-2)}`;

        date = `${year}-${month}-${datee}`;
        console.log('Result '+date);
        return date;
}

module.exports={
    GetYYYYMMDDdate
};