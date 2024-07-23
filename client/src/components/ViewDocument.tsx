import { client } from "@/services/axiosClient";
import { useAuthStore } from "@/stores/auth.store";
import React from "react";
import { useNavigate } from "react-router-dom";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { toast } from "./ui/use-toast";

const ViewDocument = ({
	id,
	page,
}: {
	id: string | undefined;
	page: string | undefined;
}) => {
	const navigate = useNavigate();
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
	const [meta, setMeta] = React.useState("");
	const [docUrl, setDocUrl] = React.useState("");
	const iframeRef = React.useRef<HTMLIFrameElement>(null);

	const docs = [{ uri: docUrl, fileName: meta }];

	React.useEffect(() => {
		if (isLoggedIn) {
			const fetchDocumentById = async () => {
				try {
					const fileMeta = await client.get(
						`http://localhost:8800/api/v1/${page}/${id}`
					);
					const res = await client.get(
						`http://localhost:8800/api/v1/${page}/view/${id}`
					);

					setMeta(
						fileMeta.data.fileMeta[0]?.Subject ?? "Allocation Form"
					);
					const { data, mimeType } = res.data;

					const byteCharacters = atob(data);
					const byteNumbers = new Array(byteCharacters.length);
					for (let i = 0; i < byteCharacters.length; i++) {
						byteNumbers[i] = byteCharacters.charCodeAt(i);
					}

					const byteArray = new Uint8Array(byteNumbers);
					const blob = new Blob([byteArray], { type: mimeType });

					const objecUrl = URL.createObjectURL(blob);
					setDocUrl(objecUrl);

					if (iframeRef.current) {
						iframeRef.current.src = objecUrl;
					}

					return () => {
						URL.revokeObjectURL(objecUrl);
					};
				} catch (error) {
					toast({
						title: "Encountered an error!",
						description: (
							<pre className="mt-2 w-[340px] rounded-md bg-red-500 p-4">
								<code className="text-white">
									{`Error - ${error}`}
								</code>
							</pre>
						),
					});
				}
			};
			fetchDocumentById();
		} else {
			navigate("/signin");
		}
	}, [isLoggedIn, navigate, id, page]);

	return (
		<>
			{/* {meta.split('.')[1] === ("xlsx" || "xls" || "xlsb" || "docx" || "doc") ? */}
			{/* <iframe src={`https://view.officeapps.live.com/op/embed.aspx?src=http://remote.url.tld/${docUrl}`} className='mt-4 w-full min-h-[20rem] max-h-[calc(100vh-10rem)] dark:bg-primary-foreground' frameBorder='0'>This is an embedded <a target='_blank' href='http://office.com'>Microsoft Office</a> document, powered by <a target='_blank' href='http://office.com/webapps'>Office Online</a>.</iframe> */}
			{/* : */}
			<DocViewer
				documents={docs}
				prefetchMethod="GET"
				pluginRenderers={DocViewerRenderers}
				className="mt-4 min-h-[20rem] max-h-[calc(100vh-10rem)] dark:bg-primary-foreground"
			/>
			{/* } */}
		</>
	);
};

export default ViewDocument;
