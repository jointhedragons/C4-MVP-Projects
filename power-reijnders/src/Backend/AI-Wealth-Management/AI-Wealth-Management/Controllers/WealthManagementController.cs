using AI_Wealth_Management.Models;
using AI_Wealth_Management.Service;
using Microsoft.AspNetCore.Mvc;

namespace AI_Wealth_Management.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WealthManagementController : ControllerBase
{
    private readonly RecommendationService _recommendationService;
    private static object? _lastRecommendation;

    public WealthManagementController(RecommendationService recommendationService)
    {
        _recommendationService = recommendationService;
    }
    
    [HttpPost]
    public IActionResult GetRecommendation([FromBody] InvestmentRequest req)
    {
        var recommendation = _recommendationService.GenerateRecommendation(req);
        _lastRecommendation = recommendation;
        return Ok(recommendation);
    }
    
    [HttpGet]
    public IActionResult GetLastRecommendation()
    {
        if (_lastRecommendation == null)
        {
            return NotFound("No recommendation available. Please submit an investment request first.");
        }
        return Ok(_lastRecommendation);
    }
}