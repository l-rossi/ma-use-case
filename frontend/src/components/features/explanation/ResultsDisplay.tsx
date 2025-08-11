import { PrologAnswerDTO } from '@dtos/dto-types';

interface ResultsDisplayProps {
  status: 'success' | 'failure' | 'error' | null;
  answers: PrologAnswerDTO[] | null;
}

export function ResultsDisplay({ status, answers }: ResultsDisplayProps) {
  if (!status || !answers) {
    return null;
  }

  return (
    <div className="p-4 border-t">
      <h3 className="text-lg font-semibold mb-4">Results</h3>

      {status === 'success' && answers.length > 0 ? (
        <div className="space-y-2">
          {answers.map((answer, index) => (
            <div key={index} className="border p-3 rounded-md">
              <h4 className="font-medium mb-2">Answer {index + 1}</h4>
              <div className="space-y-1">
                {answer.answers.map((result, resultIndex) => (
                  <div key={resultIndex} className="flex">
                    <span className="font-mono mr-2">{result.variable}:</span>
                    <span>{result.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : status === 'failure' ? (
        <>
          {/*  TODO feedback based on execution*/}
          <p className="text-green-500 font-semibold">No solutions/violations found.</p>
          <p className="text-green-500">
            This means that with the current facts, no violation was detected.
          </p>
        </>
      ) : (
        <p className="text-red-500">Error: {answers[0]?.message || 'Unknown error'}</p>
      )}
    </div>
  );
}
