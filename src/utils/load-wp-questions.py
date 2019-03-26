import sys
import os
import uuid
import datetime

in_file_path = './flight-radio/flight-radio-in.txt'
out_file_path = './flight-radio/flight-radio-out.txt'

section_key = 'section:'
question_key = 'q:'
answer_key = 'a:'
syllabus_ref_key = 'syllabus reference:'
study_ref_key = 'study reference:'

waypoints_url = 'https://www.waypoints.nz/products/vol-04-flight-radio-for-pilots-july-2016'

current_subject_id = ''
current_question = {}

### Main
def main():
  with open(in_file_path, 'r') as in_file, open(out_file_path, 'a') as out_file:
  	for line in in_file:
  		_parse_line(line, out_file)


### Parsers
def _parse_line(line, out_file):
	global current_subject_id

	if line == '\n':
		_move_to_next_question(out_file)
		return

	line = line.strip()
	if line.lower().startswith(section_key):
		subject_title = _remove_key(line, section_key)
		current_subject_id = str(uuid.uuid4())
		out_file.write('==========\n')
		out_file.write(current_subject_id + '\n' + subject_title+'\n')
		out_file.write('==========\n')

	if line.lower().startswith(question_key):
		_get_question(line)

	if line.lower().startswith(answer_key):
		_get_answer(line)

	if line.lower().startswith(syllabus_ref_key):
		_get_syllabus_reference(line)

	if line.lower().startswith(study_ref_key):
		_get_study_reference(line, out_file)

def _get_question(line):
	global current_question
	global current_subject_id

	current_question["QuestionId"] = str(uuid.uuid4())
	current_question["TopicId"] = current_subject_id
	current_question["Type"] = 'q'
	current_question["AddedDate"] = str(datetime.datetime.now()) 
	current_question["Question"] = _remove_key(line, question_key)

def _get_answer(line):
	current_question["Answer"] = _remove_key(line, answer_key)	

def _get_syllabus_reference(line):
	current_question["SyllabusRef"] = _remove_key(line, syllabus_ref_key)

def _get_study_reference(line, out_file):
	global waypoints_url
	global current_question

	ref_line = _remove_key(line, study_ref_key)
	ref = {}
	ref["Url"] = waypoints_url
	ref["Text"] = ref_line
	ref["QuestionId"] = current_question["QuestionId"]
	ref["TopicId"] = current_question["TopicId"]
	ref["Type"] = 'r'
	ref["AddedDate"] = str(datetime.datetime.now())

	out_file.write(str(ref) + '\n\n')	


### Helpers
def _move_to_next_question(out_file):
	global current_question
	if current_question == {}:
		return

	out_file.write(str(current_question) + '\n\n')

def _remove_key(line, key):
	return line[len(key):]

if __name__ == '__main__':
	main()
