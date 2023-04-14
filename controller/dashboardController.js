const Interview = require('../models/interview');
const Student = require('../models/student');

// Dashboard page
module.exports.dashboard = async function (req, res) {
  try {
    if (req.isAuthenticated()) {
      const students = await Student.find({}).populate("interviews");

      const interviews = await Interview.find({}).populate("students.student");

      return res.render('dashboard', {
        title: "Dashboard",
        students: students,
        interviews: interviews
      });
    } else {
      return res.redirect('/');
    }
  } catch (e) {
    console.log('error in loading: ', e);
    return res.redirect('back');
  }
};