using AI_Wealth_Management.Models;

namespace AI_Wealth_Management.Service;

public interface IInvestmentAdviceService
{
    Task<string> GetAdviceAsync(InvestmentRequest req);
}