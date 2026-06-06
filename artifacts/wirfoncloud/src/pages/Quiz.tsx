export default function Quiz() {
  return (
    <div className="quiz-page">
      <div className="quiz-page-header">
        <h1>Test Your Linux Knowledge</h1>
        <p>Take our free 10-question Linux Career Readiness Quiz — discover your starting point in IT, Cloud and AI.</p>
      </div>
      <div className="quiz-iframe-wrap">
        <iframe
          src="https://wirfoncloud.github.io/linux-quiz-assessment/"
          title="Linux Career Readiness Quiz"
          allowFullScreen
        />
      </div>
    </div>
  );
}
