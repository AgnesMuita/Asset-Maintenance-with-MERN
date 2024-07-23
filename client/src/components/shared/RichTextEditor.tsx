import { formats, modules } from "@/utils/consts";
import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const RichTextEditor = (props: { initValue?: string }) => {
	const [value, setValue] = React.useState("");

	const handleChange = (html: string) => {
		setValue(html);
	};

	return (
		<ReactQuill
			theme="snow"
			value={value}
			defaultValue={props.initValue}
			modules={modules}
			formats={formats}
			placeholder="Write content here..."
			onChange={handleChange}
		/>
	);
};

export default RichTextEditor;
