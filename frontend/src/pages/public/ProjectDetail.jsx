import { useParams } from 'react-router-dom';

export default function ProjectDetail() {
  const { slug } = useParams();
  return <div className="pt-20 px-6"><h1 className="text-2xl font-bold">Project: {slug}</h1></div>;
}
