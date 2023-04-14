const Interview = require('../models/interview');
const Student = require('../models/student');

//add interview page
module.exports.addInterview = (req, res) => {
  if (req.isAuthenticated()) {
    return res.render('add_interview', {
      title: 'Add an interview'
    });
  }
  return res.redirect('/');
};

//new interview
module.exports.create = async function (req, res) {
  try {
    const { company, date } = req.body;

    const interview = await Interview.create({ company, date });

    return res.redirect('back');
  }
  catch (e) {
    console.log('Error in creating interview: ', e);
    return res.redirect('back');
  }
}

//add student in interview
module.exports.enrollInterview = async function (req, res) {
  try {
    const interview = await Interview.findById(req.params.id);
    const { email, result } = req.body;

    if (interview) {
      const student = await Student.findOne({ email: email });

      if (student) {
        //check if already enrolled
        const check = await Interview.findOne({
          "students.student": student.id
        });

        //if already enrolled
        if (check) {
          if (check.company === interview.company) {
            req.flash(
              'error',
              `${student.name} already enrolled in ${interview.company}`
            )
            return res.redirect('back');
          }
        }

        const studentObj = {
          student: student.id,
          result: result
        };

        await interview.updateOne({
          $push: { students: studentObj }
        });

        // update interview
        const assignedInterview = {
          company: interview.company,
          date: interview.date,
          result: result,
        };
        await student.updateOne({
          $push: { interviews: assignedInterview },
        });

        console.log(
          "success",
          `${student.name} enrolled in ${interview.company} interview!`
        );

        return res.redirect("back");
      }

      return res.redirect('back');
    }

    return res.redirect('back');
  }
  catch (e) {
    console.log('Error in enrolling:', e);
    return res.redirect('back');
  }
};

// removing student from interview
module.exports.deallocate = async function (req, res) {
  try {
    const { studentId, interviewId } = req.params;
    const interview = await Interview.findById(interviewId);

    //find interview and pull out student from students array
    if (interview) {
      await interview.updateOne({
        $pull: { students: { student: studentId } }
      });

      // similarly update the student by removing company from interviews array
      await Student.findOneAndUpdate(
        { _id: studentId },
        { $pull: { interviews: { company: interview.company } } }
      );

      return res.redirect("back");
    }
    return res.redirect("back");
  }
  catch (e) {
    console.log('Error in removing unenrolling student:', e);
    return res.redirect('back');
  }
};
