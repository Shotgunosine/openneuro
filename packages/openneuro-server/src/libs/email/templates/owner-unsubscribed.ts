export const ownerUnsubscribed = ({
  siteUrl,
  name,
  datasetName,
}: {
  siteUrl: string
  name: string
  datasetName: string
}): string => `<html>
<head>
<style>
	body {
		font-family: sans-serif;
		font-weight: lighter;
		background: #F5F5F5;
	}
	.top-bar {
		width: 100%;
		background: #333;
		padding: 8px 0px 8px 15px;
	}
	.content {
		padding: 15px;
	}
	p {
		font-size: 16px;
		font-weight: lighter;
	}
	b {
		font-weight: bold;
	}
	.dataset-link {
		display: inline-block;
		background: #5cb85c;
		color: #FFF;
		font-size: 20px;
		padding: 8px 15px;
		text-decoration: none;
		cursor: pointer;
	}
	.FAILED {color: #d9534f;}
	.FINISHED {color: #5cb85c;}
</style>
</head>
<body>
	<div class="top-bar">
		<img src="${siteUrl}/assets/email-header.1cb8bf76.png" />
	</div>
	<div class="content">
		<h2>Hi, ${name}</h2>

		<p>
			The owner of a dataset you follow, <b>${datasetName}</b>, has stopped tracking comments / changes to their dataset.
		</p>

		<p>
			Sincerely,
			The CRN Team
		</p>
	</div>
</body>
<html>`
