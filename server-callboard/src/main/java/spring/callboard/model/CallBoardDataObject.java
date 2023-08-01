package spring.callboard.model;

import java.io.Serializable;

import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import jakarta.validation.constraints.*;

import lombok.Data;
@JsonTypeInfo(use = JsonTypeInfo.Id.DEDUCTION)
@Data
@Validated
public class CallBoardDataObject implements Serializable{

	private static final long serialVersionUID = 1L;
	
	Integer id;
	@NotEmpty
	String category;
	@NotEmpty
	String name;
	@NotNull
	@Min(0)
	Float price;
	String data;

}
