# Privacy notes

This tool is designed so that no personally identifiable student information needs to leave the teacher's computer.

## What happens to the text

1. The teacher pastes writing into the page. Nothing is sent until "Get feedback" is pressed.
2. Before sending, the page removes common identifiers automatically: email addresses, phone numbers, long ID numbers, and names introduced with "My name is / Me llamo / Mi nombre es". The teacher sees what was removed.
3. The cleaned text and the form settings are sent directly from the browser to Anthropic's Messages API. There is no server of ours in between, and the tool stores nothing.
4. The API key is kept in the browser's session storage and disappears when the tab closes.

Anthropic's handling of API data is described in its [commercial terms and privacy policy](https://www.anthropic.com/legal). Check the current terms with your district.

## What the teacher must still do

- **Remove names and identifiers.** Automatic removal is a safety net, not a guarantee. It cannot catch a classmate's name, a teacher's name, or a detail that identifies a student.
- **Get approval before using real student work.** Districts have their own rules for AI tools and student data (FERPA, state law, district policy). In a pilot, use synthetic or fully de-identified samples until the tool is approved.
- **Review before sharing.** Every message to a student is a draft for the teacher.

## What the tool never does

- Score writing or assign a proficiency level
- Store or log student text
- Make decisions about a student
