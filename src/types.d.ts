interface ChessGame extends Record<string, string | number> {
  id: string;
  rated: "X" | "✓";
  created_at: number; // utc
  last_move_at: number; // utc
  turns: number;
  victory_status: "outoftime" | "resign" | "mate" | "draw";
  winner: "black" | "white";
  increment_code: string;
  white_id: string;
  white_rating: number;
  black_id: string;
  black_rating: number;
  moves: string;
  opening_eco: string;
  opening_name: string;
  opening_ply: number;
}
