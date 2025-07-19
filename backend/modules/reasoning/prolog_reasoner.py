import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class PrologReasoner:
    """
    A reasoner that executes Prolog code using an HTTP connection to a Prolog engine.
    This reasoner does not inherit from SymbolicReasoner.
    """
    
    def __init__(self):
        """
        Initialize the PrologReasoner with the URL of the Prolog engine.
        The URL is read from the SWI_PROLOG_URL environment variable.
        """
        self.prolog_url = os.getenv("SWI_PROLOG_URL")
        if not self.prolog_url:
            raise ValueError("SWI_PROLOG_URL environment variable is not set")
    
    def execute_prolog(self, prolog_code: str):
        """
        Execute Prolog code using the Prolog engine.
        
        Args:
            prolog_code (str): The Prolog code to execute.
            
        Returns:
            dict: The result of the execution.
            
        Raises:
            Exception: If the HTTP request fails or the Prolog engine returns an error.
        """
        try:
            response = requests.post(
                f"{self.prolog_url}/eval",
                json={"code": prolog_code}
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            raise Exception(f"Failed to execute Prolog code: {str(e)}")