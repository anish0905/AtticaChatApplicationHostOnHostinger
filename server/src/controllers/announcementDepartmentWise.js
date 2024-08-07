const AnnounceDepartmentWise = require("../model/annoucementDepartmentWise")

const postAnnouncement = async (req, res) => {
    try {
        const {department,sender, name,text} = req.body

        if(!department||!sender||!name||!text){
            return res.status(400).json({ message: "Please fill all the fields" });
        }

        const announcement = new AnnounceDepartmentWise({
            department,
            sender,
            name,
            content: { text },
        })

        await announcement.save()

        res.status(201).json(announcement)

        
    } catch (error) {
        res.status(400).json({ message: error.message });
        
    }
}

const getAnnouncementsByDepartment = async (req, res) => {
    try {
        const { department } = req.params

        let NewDepartment = "";

        if (department === "Bouncers") {
            NewDepartment = "Bouncers/Driver";
          } else if (department === "Security") {
            NewDepartment = "Security/CCTV";
          } else {
            NewDepartment = department;
          }

        const announcements = await AnnounceDepartmentWise.find({ department:NewDepartment })
        res.json(announcements)
        
    } catch (error) {
        res.status(400).json({ message: error.message });
        
    }
}

const updateAnnouncement = async (req, res) => {
    try {
        const { id } = req.params
        const { text } = req.body
        
        if(!text){
            return res.status(400).json({ message: "Please provide new announcement text" });
        }
        
        const updatedAnnouncement = await AnnounceDepartmentWise.findByIdAndUpdate(id, { content:{text} }, { new: true })
        
        if(!updatedAnnouncement){
            return res.status(404).json({ message: "Announcement not found" });
        }
        
        res.json(updatedAnnouncement)
        
    } catch (error) {
        res.status(400).json({ message: error.message });
        
    }
}

const deleteAnnouncement = async (req, res) => {
    try {
        const { id } = req.params
        
        const deletedAnnouncement = await AnnounceDepartmentWise.findByIdAndDelete(id)
        
        if(!deletedAnnouncement){
            return res.status(404).json({ message: "Announcement not found" });
        }
        
        res.json(deletedAnnouncement)
        
    } catch (error) {
        res.status(400).json({ message: error.message });
        
    }
}


module.exports = {
    postAnnouncement,
    getAnnouncementsByDepartment,
    updateAnnouncement,
    deleteAnnouncement
}