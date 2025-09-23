using AI_Wealth_Management.Models;
using AI_Wealth_Management.Service;
using Microsoft.AspNetCore.Mvc;

namespace AI_Wealth_Management.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
private readonly IInvestmentAdviceService _adviceService;
    
    public ChatController(IInvestmentAdviceService adviceService)
    {
        _adviceService = adviceService;
    }
    
    [HttpGet("ask")]
    public async Task<IActionResult> AskGet(
        [FromQuery] decimal capital,
        [FromQuery] string horizon,
        [FromQuery] string risk)
    {
        var req = new InvestmentRequest
        {
            Capital = capital,
            Horizon = horizon,
            Risk = risk
        };
        var answer = await _adviceService.GetAdviceAsync(req);
        return Ok(new { Answer = answer });
    }

}