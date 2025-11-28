function GetAllJobsData (){
    const data = [
        {
            date: "22 / 01 / 2025",
            fullName: "Steve Jobs",
            type: "MC",
            description: "I got flu",
        },
        {
            date: "08 / 01 / 2025",
            fullName: "Ryo Adams",
            type: "Leave",
            description: "Maternal Leave",
        },
        {
            date: "03 / 01 / 2025",
            fullName: "James Dean",
            type: "MC",
            description: "I'm down with covid",
        },
        {
            date: "25 / 12 / 2024",
            fullName: "Robby Aims",
            type: "Leave",
            description: "I need to take care of grandma",
        },
        {
            date: "22 / 12 / 2024",
            fullName: "Vanderbuilt Labs",
            type: "Leave",
            description: "Burnout",
        }
    ]
    return data;
}


export default {
    GetAllJobsData,
}