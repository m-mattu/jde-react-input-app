export const DateConvertor = (date) => {
    if(date !== "null"){
        let year;
        let month;
        let day;
        if(typeof date === 'object'){
            let currentMonth = date.getMonth() + 1;
            year = date.getFullYear();
            month = currentMonth <10? "" + "0" + currentMonth: currentMonth;
            day = date.getDate();
        }else{
            year = date.substring(0,4);
            month = date.substring(5,7);
            day = date.substring(8,10);
        }
        let returnDate = [month,day,year].join('/');
        
        if(returnDate === "//"){
            returnDate = "";
        };
        return returnDate;
    }
}