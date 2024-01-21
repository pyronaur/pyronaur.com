import sharp from "sharp";
import { readFile } from "node:fs/promises";
import satori, { type SatoriOptions } from "satori";
import { profile, background } from './open-graph-inlined-assets';


const Wrapper = ({ children }) => (
	<div
		style={{
			display: 'flex',
			height: '100%',
			width: '100%',
			alignItems: 'center',
			justifyContent: 'center',
			fontWeight: 700,
			background: 'red',
			position: 'relative',
		}}
	>
		{children}
	</div>
)

const BackgroundImage = () => (
	<img
		width={1280}
		height={853}
		src={background}
		style={{
			position: 'absolute',
			top: 0,
			left: 0,
			bottom: 0,
			right: 0,
			width: '100%',
			height: '100%',
		}}
	/>
)

const Title = ({ children }) => (
	<div
		style={{
			fontSize: 48,
			color: 'hsl(188, 60%, 14%)',
			fontFamily: 'Noto700',
			marginBottom: 25,
			lineHeight: 1.4,
		}}
	>
		{children}
	</div>
)



const Content = ({ children }) => (
	<div
		style={{
			display: 'flex',
			// justifyContent: 'center',
			flexDirection: 'column',
			alignItems: 'flex-start',
			overflow: 'hidden',
			background: 'white',
			borderRadius: 32,
			padding: "120px 75px 75px 75px",
			position: 'absolute',
			top: 25,
			left: 40,
			right: 40,
			bottom: 25,
		}}>
		{children}
	</div>
);

const Summary = ({ summary }: { summary: string }) => {
	if( ! summary ) {
		return;
	}
	return (
		<div style={{
			display: 'flex',
			'flexDirection': 'column',
		}}>
			{
				summary.split("\n").map(text => {
					return (
						<p
							style={{
								fontSize: 27,
								lineHeight: 1.4,
								marginTop: -18,
								fontFamily: 'Noto400',
								color: 'hsl(188, 10%, 44%)',
							}}
						>
							{text}
						</p>
					)
				})
			}
		</div >
	);
}


const Footer = ({ slug }) => (
	<div
		style={{
			position: 'absolute',
			bottom: 0,
			left: 0,
			right: 0,
			// height: 120,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
			padding: '25px 50px',
			backgroundColor: 'hsl(188, 38%, 97%)',
			borderTop: '2px solid hsl(188, 45%, 92%)',
			// color: 'white',
			fontFamily: 'Noto400',
			fontSize: 24,
			letterSpacing: '1px',
		}}
	>
		<img
			src={profile}
			width={100}
			height={100}
			style={{
				width: 72,
				height: 72,
				borderRadius: "50%",
				marginLeft: 8
			}} />
		<div style={{
			display: 'flex',
			marginLeft: 16,
			color: 'hsl(188, 70%, 33%)',
			fontFamily: 'Noto600',
		}}>
			@pyronaur
		</div>
		<div
			style={{
				marginLeft: 'auto',
				display: 'flex',
				alignItems: 'center',
				color: 'black',
				fontFamily: 'Noto400',
			}}
		>
			<span
				style={{
					marginLeft: 8,
					color: 'hsl(188, 64%, 33%)',
				}}
			>
				pyronaur.com
			</span>
			{slug.length < 40 && (
				<span
					style={{
						color: 'hsl(188, 70%, 30%)',
						fontFamily: 'Noto600',
					}}
				>
					/{slug}
				</span>)}
		</div>
	</div>
);

/**
 * Opengraph template to generate svg
 */
const Template = ({ slug, title, date, summary }) => (
	<Wrapper>
		<BackgroundImage />
		<Content>
			<Title>{title}</Title>

			{/* Description */}
			<Summary summary={summary} />

			<div
				style={{
					fontSize: 20,
					marginTop: 28,
					lineHeight: 1.5,
					fontFamily: 'Noto400',
					color: 'hsl(188, 20%, 75%)',
				}}
			>
				{new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
			</div>
			<Footer slug={slug} />
		</Content>
	</Wrapper >


)

/**
 * generate filename / path for generated OG images
 *
 * @param filename filename in asset folder
 * @returns
 */
export const getOgImagePath = (filename: string) => {
	if (filename.startsWith("/")) {
		filename = filename.substring(1);
	}

	if (filename.endsWith("/")) {
		filename = filename.substring(0, filename.length - 1);
	}



	return `./open-graph/${filename}.png`;
};

/**
 * generate opengraph image with satori and return a buffer
 *
 * @param text
 */
const generateOgImage = async (props): Promise<Buffer> => {
	const options: SatoriOptions = {
		width: 1200,
		height: 630,
		embedFont: true,
		fonts: [
			{
				name: 'Noto400',
				data: await readFile("./src/assets/font/Noto400.ttf"),
			},
			{
				name: 'Noto500',
				data: await readFile("./src/assets/font/Noto500.ttf"),
			},
			{
				name: 'Noto600',
				data: await readFile("./src/assets/font/Noto600.ttf"),
			},
			{
				name: 'Noto700',
				data: await readFile("./src/assets/font/Noto700.ttf"),
			},
		],
	};

	const svg = await satori(
		Template(props),
		options
	);

	const sharpSvg = Buffer.from(svg);
	const buffer = await sharp(sharpSvg).toBuffer();
	return buffer;
};

export default generateOgImage;